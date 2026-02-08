#!/bin/bash

# Script para mapear vídeos necessários baseado nos exercícios do treino
# Este script analisa os exercícios cadastrados e identifica os vídeos correspondentes

echo "🔍 Analisando exercícios do treino..."

# Diretório dos vídeos
VIDEO_DIR="/Users/guilhermeloureiro/Downloads/TREINO - GUILHERME/EXERCICIOS"

# Criar diretório de saída
OUTPUT_DIR="/Users/guilhermeloureiro/Downloads/TREINO - GUILHERME/meus-treinos-v2/videos-necessarios"
mkdir -p "$OUTPUT_DIR"

# Lista de exercícios do seu treino (baseado no seed.sql)
# Vou extrair isso do banco de dados

echo "📋 Exercícios encontrados no seu treino:"
echo ""

# Aqui vamos listar os vídeos que correspondem aos exercícios
# Por enquanto, vou criar um relatório

echo "📊 Gerando relatório de mapeamento..."
echo ""

# Contar total de vídeos
TOTAL_VIDEOS=$(ls -1 "$VIDEO_DIR"/*.mp4 2>/dev/null | wc -l)
echo "Total de vídeos disponíveis: $TOTAL_VIDEOS"

# Calcular tamanho total
TOTAL_SIZE=$(du -sh "$VIDEO_DIR" | cut -f1)
echo "Tamanho total: $TOTAL_SIZE"

echo ""
echo "✅ Script pronto! Aguardando análise dos exercícios do banco..."
