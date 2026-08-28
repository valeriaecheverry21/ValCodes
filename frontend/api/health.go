package handler

import (
	"encoding/json"
	"net/http"
	"time"
)

// Handler es la función serverless de Vercel para /api/health
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "method not allowed"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(map[string]any{
		"status":  "ok",
		"service": "portfolio-valeria-api",
		"time":    time.Now().UTC().Format(time.RFC3339),
		"stack":   []string{"Go", "Vercel Serverless"},
	})
}
