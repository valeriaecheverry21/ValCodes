package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
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

// Handler es la función serverless de Vercel para /api/contact
func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

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

	// Si no hay API key de Resend configurada, respondemos con error claro
	// para que el usuario sepa que falta configurar la variable de entorno.
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		writeJSON(w, http.StatusInternalServerError, apiResponse{
			Status:  "error",
			Message: "RESEND_API_KEY no configurada. Configuralá en Vercel.",
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
	// html escapado básico para evitar inyección de HTML
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
		"from":    from,
		"to":      []string{to},
		"subject": subject,
		"html":    html,
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

	client := &http.Client{}
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

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
