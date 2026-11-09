package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"time"
)

// Health es la función serverless de Vercel para /api/health.
// Indica si cada canal de contacto está configurado (sin exponer las claves).
func Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Método no permitido."})
		return
	}

	_ = json.NewEncoder(w).Encode(map[string]any{
		"status":  "ok",
		"service": "portfolio-valeria-api",
		"time":    time.Now().UTC().Format(time.RFC3339),
		"channels": map[string]bool{
			"email":    os.Getenv("RESEND_API_KEY") != "",
			"whatsapp": os.Getenv("CALLMEBOT_PHONE") != "" && os.Getenv("CALLMEBOT_APIKEY") != "",
		},
	})
}
