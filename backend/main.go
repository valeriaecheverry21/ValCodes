package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/mail"
	"net/url"
	"os"
	"strings"
	"time"
	"unicode/utf8"
)

// Límites para evitar abusos
const (
	maxBodyBytes  = 16 << 10 // 16 KB
	maxNameLen    = 100
	maxMessageLen = 1000
)

type message struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	// Campo trampa (honeypot): los humanos no lo ven; si viene con datos es un bot
	Website string `json:"website"`
}

type apiResponse struct {
	Status   string            `json:"status"`
	Message  string            `json:"message,omitempty"`
	Channels map[string]string `json:"channels,omitempty"`
}

var httpClient = &http.Client{Timeout: 10 * time.Second}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, apiResponse{Status: "error", Message: "Método no permitido."})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"status":  "ok",
		"service": "portfolio-valeria-api",
		"time":    time.Now().UTC().Format(time.RFC3339),
		"channels": map[string]bool{
			"email":    os.Getenv("RESEND_API_KEY") != "",
			"whatsapp": os.Getenv("CALLMEBOT_PHONE") != "" && os.Getenv("CALLMEBOT_APIKEY") != "",
		},
	})
}

// handleContact recibe el formulario y lo reenvía por email y/o WhatsApp
func handleContact(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, apiResponse{Status: "error", Message: "Método no permitido."})
		return
	}

	var m message
	r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		writeJSON(w, http.StatusBadRequest, apiResponse{Status: "error", Message: "El cuerpo de la petición no es válido."})
		return
	}

	// Bot detectado: respondemos OK sin enviar nada para no darle pistas
	if strings.TrimSpace(m.Website) != "" {
		writeJSON(w, http.StatusOK, apiResponse{Status: "ok", Message: "¡Mensaje enviado! Gracias por contactarme."})
		return
	}

	if msg := validate(&m); msg != "" {
		writeJSON(w, http.StatusBadRequest, apiResponse{Status: "error", Message: msg})
		return
	}

	channels := map[string]string{}
	delivered := 0

	// 1) Email vía Resend
	if apiKey := os.Getenv("RESEND_API_KEY"); apiKey != "" {
		from := envOr("CONTACT_FROM_EMAIL", "Portfolio <onboarding@resend.dev>")
		to := envOr("CONTACT_TO_EMAIL", "valeriaecheverryzl@hotmail.com")
		if err := sendEmail(apiKey, from, to, m); err != nil {
			log.Printf("email: %v", err)
			channels["email"] = "error"
		} else {
			channels["email"] = "ok"
			delivered++
		}
	} else {
		log.Print("email: RESEND_API_KEY no configurada")
		channels["email"] = "no configurado"
	}

	// 2) Aviso por WhatsApp vía CallMeBot (opcional)
	phone, waKey := os.Getenv("CALLMEBOT_PHONE"), os.Getenv("CALLMEBOT_APIKEY")
	if phone != "" && waKey != "" {
		if err := sendWhatsApp(phone, waKey, m); err != nil {
			log.Printf("whatsapp: %v", err)
			channels["whatsapp"] = "error"
		} else {
			channels["whatsapp"] = "ok"
			delivered++
		}
	}

	if delivered == 0 {
		writeJSON(w, http.StatusBadGateway, apiResponse{
			Status:   "error",
			Message:  "No se pudo enviar el mensaje en este momento.",
			Channels: channels,
		})
		return
	}

	writeJSON(w, http.StatusOK, apiResponse{
		Status:   "ok",
		Message:  "¡Mensaje enviado! Gracias por contactarme.",
		Channels: channels,
	})
}

func validate(m *message) string {
	m.Name = strings.TrimSpace(m.Name)
	m.Email = strings.TrimSpace(m.Email)
	m.Message = strings.TrimSpace(m.Message)

	switch {
	case utf8.RuneCountInString(m.Name) < 2 || utf8.RuneCountInString(m.Name) > maxNameLen:
		return "Ingresá un nombre válido (2 a 100 caracteres)."
	case !validEmail(m.Email):
		return "Ingresá un email válido."
	case utf8.RuneCountInString(m.Message) < 10:
		return "El mensaje debe tener al menos 10 caracteres."
	case utf8.RuneCountInString(m.Message) > maxMessageLen:
		return "El mensaje no puede superar los 1000 caracteres."
	}
	return ""
}

func validEmail(s string) bool {
	addr, err := mail.ParseAddress(s)
	return err == nil && addr.Address == s && strings.Contains(s[strings.LastIndex(s, "@"):], ".")
}

func sendEmail(apiKey, from, to string, m message) error {
	esc := strings.NewReplacer("&", "&amp;", "<", "&lt;", ">", "&gt;", `"`, "&quot;", "'", "&#39;").Replace
	html := fmt.Sprintf(
		`<div style="font-family:sans-serif;max-width:560px">`+
			`<h2 style="margin:0 0 16px">Nuevo mensaje desde el portfolio</h2>`+
			`<p><strong>Nombre:</strong> %s</p>`+
			`<p><strong>Email:</strong> <a href="mailto:%s">%s</a></p>`+
			`<p><strong>Mensaje:</strong></p>`+
			`<p style="white-space:pre-wrap;background:#f4f5f7;padding:12px;border-radius:8px">%s</p>`+
			`</div>`,
		esc(m.Name), esc(m.Email), esc(m.Email), esc(m.Message),
	)
	text := fmt.Sprintf("Nombre: %s\nEmail: %s\n\n%s", m.Name, m.Email, m.Message)

	payload, err := json.Marshal(map[string]any{
		"from":     from,
		"to":       []string{to},
		"subject":  "Nuevo mensaje del portfolio: " + m.Name,
		"html":     html,
		"text":     text,
		"reply_to": m.Email,
	})
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(payload))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return fmt.Errorf("Resend respondió %d: %s", resp.StatusCode, body)
	}
	return nil
}

// sendWhatsApp manda un aviso al WhatsApp de Valeria usando CallMeBot (https://www.callmebot.com)
func sendWhatsApp(phone, apiKey string, m message) error {
	text := fmt.Sprintf("📩 *Nuevo mensaje del portfolio*\n\n*Nombre:* %s\n*Email:* %s\n\n%s", m.Name, m.Email, m.Message)
	q := url.Values{}
	q.Set("phone", phone)
	q.Set("text", text)
	q.Set("apikey", apiKey)

	resp, err := httpClient.Get("https://api.callmebot.com/whatsapp.php?" + q.Encode())
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
	// CallMeBot devuelve 200 incluso con algunos errores; revisamos el texto
	if resp.StatusCode >= 300 || strings.Contains(strings.ToLower(string(body)), "error") {
		return fmt.Errorf("CallMeBot respondió %d: %s", resp.StatusCode, body)
	}
	return nil
}

// setCORS permite llamar a la API desde otros dominios (ej. GitHub Pages).
// ALLOWED_ORIGINS acepta una lista separada por comas; vacío = cualquier origen.
func setCORS(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	allowed := os.Getenv("ALLOWED_ORIGINS")
	switch {
	case allowed == "":
		w.Header().Set("Access-Control-Allow-Origin", "*")
	case origin != "":
		for _, o := range strings.Split(allowed, ",") {
			if strings.TrimSpace(o) == origin {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Vary", "Origin")
				break
			}
		}
	}
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func envOr(key, def string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return def
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// loadEnv lee un archivo .env (KEY=valor por línea) sin pisar variables ya definidas
func loadEnv(path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		k, v, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		k = strings.TrimSpace(k)
		v = strings.Trim(strings.TrimSpace(v), `"'`)
		if _, exists := os.LookupEnv(k); !exists {
			os.Setenv(k, v)
		}
	}
	log.Printf("variables cargadas desde %s", path)
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		setCORS(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func dataHandler(dataType string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			writeJSON(w, http.StatusMethodNotAllowed, apiResponse{Status: "error", Message: "method not allowed"})
			return
		}
		var data []any
		switch dataType {
		case "projects":
			data = sampleProjects()
		case "experience":
			data = sampleExperience()
		default:
			writeJSON(w, http.StatusNotFound, apiResponse{Status: "error", Message: "tipo no encontrado"})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"type": dataType, "count": len(data), "items": data})
	}
}

// sampleProjects y sampleExperience comparten los datos del frontend para
// demostrar el patrón API + UI. En producción convendría servirlos desde una fuente de datos real.
func sampleProjects() []any {
	return []any{
		map[string]string{
			"name": "Burakku-Kohi",
			"tech": "React, JavaScript, Firebase",
			"link": "https://github.com/valeriaecheverry21/Burakku-Kohi",
		},
		map[string]string{
			"name": "CatLin-Studio",
			"tech": "HTML, CSS, JavaScript",
			"link": "https://github.com/valeriaecheverry21/CatLin-Studio",
		},
		map[string]string{
			"name": "chatbot-whatsapp",
			"tech": "Go, Web",
			"link": "https://github.com/valeriaecheverry21/chatbot-whatsapp",
		},
	}
}

func sampleExperience() []any {
	return []any{
		map[string]string{
			"role":    "Desarrollador FullStack",
			"company": "KPMG Argentina",
			"period":  "03/2025 — Presente",
		},
		map[string]string{
			"role":    "Desarrollador de Aplicaciones",
			"company": "Buafest",
			"period":  "06/2020 — 02/2025",
		},
		map[string]string{
			"role":    "Analista de Sistemas",
			"company": "Accenture",
			"period":  "10/2017 — 06/2020",
		},
	}
}

func main() {
	loadEnv(".env")

	port := envOr("PORT", "8080")

	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", handleHealth)
	mux.HandleFunc("/api/contact", handleContact)
	mux.HandleFunc("/api/projects", dataHandler("projects"))
	mux.HandleFunc("/api/experience", dataHandler("experience"))

	log.Printf("email (Resend): %v · whatsapp (CallMeBot): %v",
		os.Getenv("RESEND_API_KEY") != "",
		os.Getenv("CALLMEBOT_PHONE") != "" && os.Getenv("CALLMEBOT_APIKEY") != "")
	log.Printf("portfolio-valeria API escuchando en http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, withCORS(mux)); err != nil {
		log.Fatal(err)
	}
}
