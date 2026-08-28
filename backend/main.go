package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

type message struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

type apiResponse struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
}

// dataResponse modela un elemento reutilizable (proyecto o experiencia) servido por la API.
type dataResponse struct {
	ID   string `json:"id"`
	Type string `json:"type"`
	Data any    `json:"data"`
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		log.Printf("error encoding response: %v", err)
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, apiResponse{Status: "error", Message: "method not allowed"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"status":  "ok",
		"service": "portfolio-valeria-api",
		"time":    time.Now().UTC().Format(time.RFC3339),
		"stack":   []string{"Go", "net/http"},
	})
}

func handleContact(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, apiResponse{Status: "error", Message: "method not allowed"})
		return
	}

	var m message
	dec := json.NewDecoder(r.Body)
	if err := dec.Decode(&m); err != nil {
		writeJSON(w, http.StatusBadRequest, apiResponse{Status: "error", Message: "cuerpo inválido"})
		return
	}

	m.Name = strings.TrimSpace(m.Name)
	m.Email = strings.TrimSpace(m.Email)
	m.Message = strings.TrimSpace(m.Message)

	if m.Name == "" || m.Email == "" || m.Message == "" {
		writeJSON(w, http.StatusBadRequest, apiResponse{Status: "error", Message: "nombre, email y mensaje son obligatorios"})
		return
	}

	log.Printf("mensaje recibido de %q <%s> (%d chars)", m.Name, m.Email, len(m.Message))

	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		writeJSON(w, http.StatusInternalServerError, apiResponse{
			Status:  "error",
			Message: "RESEND_API_KEY no configurada. Configuralá en la variable de entorno.",
		})
		return
	}

	from := os.Getenv("CONTACT_FROM_EMAIL")
	if from == "" {
		from = "onboarding@resend.dev"
	}
	to := os.Getenv("CONTACT_TO_EMAIL")
	if to == "" {
		to = "valeriaecheverryzl@hotmail.com"
	}

	if err := sendEmail(apiKey, from, to, m); err != nil {
		log.Printf("error enviando email: %v", err)
		writeJSON(w, http.StatusInternalServerError, apiResponse{
			Status:  "error",
			Message: "no se pudo enviar el email: " + err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, apiResponse{
		Status:  "ok",
		Message: "mensaje enviado. ¡Gracias por contactarte!",
	})
}

func sendEmail(apiKey, from, to string, m message) error {
	escHTML := func(s string) string {
		r := strings.NewReplacer("&", "&amp;", "<", "&lt;", ">", "&gt;", `"`, "&quot;")
		return r.Replace(s)
	}

	subject := fmt.Sprintf("Nuevo mensaje del portfolio: %s", escHTML(m.Name))
	html := fmt.Sprintf(
		"<h3>Nuevo mensaje desde el portfolio</h3>"+
			"<p><strong>Nombre:</strong> %s</p>"+
			"<p><strong>Email:</strong> %s</p>"+
			"<p><strong>Mensaje:</strong><br>%s</p>",
		escHTML(m.Name), escHTML(m.Email), escHTML(m.Message),
	)

	payload := map[string]any{
		"from":     from,
		"to":       []string{to},
		"subject":  subject,
		"html":     html,
		"reply_to": m.Email,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return fmt.Errorf("Resend respondió con %d: %s", resp.StatusCode, string(respBody))
	}
	return nil
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
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", handleHealth)
	mux.HandleFunc("/api/contact", handleContact)
	mux.HandleFunc("/api/projects", dataHandler("projects"))
	mux.HandleFunc("/api/experience", dataHandler("experience"))

	log.Printf("portafolio-valeria API escuchando en http://localhost:%s", port)
	if err := http.ListenAndServe(":"+port, enableCORS(mux)); err != nil {
		log.Fatal(err)
	}
}
