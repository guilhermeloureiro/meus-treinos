const fs = require('fs');
const path = require('path');

// 1. List of exercises from seed.sql
const exercises = [
    // TREINO 1
    'Rosca direta',
    'Rosca Scott máquina',
    'Rosca unilateral de costas',
    'Manguito rotador',
    'Supino máquina',
    'Dumbbell press 30º',
    'Cross over em baixo',
    'Crucifixo máquina',
    'Abdômen máquina',

    // TREINO 2
    'Tríceps testa na polia alta',
    'Tríceps pulley com corda',
    'Tríceps Francês unilateral',
    'Pulley frente',
    'Remada do Lalá',
    'Pulley frente supinado',
    'Crucifixo inverso na máquina',

    // TREINO 3
    'Agachamento livre',
    'Leg press',
    'Cadeira extensora',
    'Panturrilha em pé',
    'Panturrilha sentado',
    'Panturrilha no Leg press',

    // TREINO 4
    'Mesa Flexora',
    'Cadeira Flexora',
    'Stiff',
    'Elevação diagonal',
    'Elevação lateral unilateral na polia média',
    'Elevação lateral máquina',

    // TREINO 5
    'Pulley frente com triângulo',
    'Dumbbell press reto',
    'Pull over',
    'Rosca simultânea',
    'Tríceps testa na polia alta com corda',
    'Abdominal máquina'
];

// Directory containing the videos
const videoDir = '/Users/guilhermeloureiro/Downloads/TREINO - GUILHERME/EXERCICIOS';
const outputDir = '/Users/guilhermeloureiro/Downloads/TREINO - GUILHERME/meus-treinos-v2';

// Helper to normalize strings for comparison
function normalize(str) {
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]/g, ""); // Remove special chars
}

function findBestMatch(exerciseName, videoFiles) {
    const normExercise = normalize(exerciseName);

    // 1. Exact match (normalized)
    let match = videoFiles.find(f => normalize(path.parse(f).name) === normExercise);
    if (match) return match;

    // 2. Contains match (exercise name inside filename)
    match = videoFiles.find(f => normalize(path.parse(f).name).includes(normExercise));
    if (match) return match;

    // 3. Reverse contains (filename inside exercise name - rare but possible)
    match = videoFiles.find(f => normExercise.includes(normalize(path.parse(f).name)));
    if (match) return match;

    // 4. Special manual mappings for known discrepancies
    const manualMap = {
        'rosca scott maquina': 'Rosca Scott.mp4',
        'rosca unilateral de costas': 'Rosca Unilateral de Costas para Polia.mp4', // Palpite
        'dumbbell press 30º': 'Dumbbell Press Inclinado 30 Graus.mp4',
        'dumbbell press 30': 'Dumbbell Press Inclinado 30 Graus.mp4',
        'cross over em baixo': 'Cross Over Embaixo.mp4',
        'abdomen maquina': 'Abdominal Máquina.mp4',
        'triceps frances unilateral': 'Tríceps Francês Unilateral.mp4',
        'pulley frente supinado': 'Pulley Frente Supinado ou Fechado.mp4',
        'agachamento livre': 'Agachamento Livre.mp4',
        'leg press': 'Leg Press 45 graus.mp4', // Palpite, comum ser o 45
        'panturrilha no leg press': 'Panturrilha no Leg Press.mp4',
        'elevacao lateral unilateral na polia media': 'Elevação Lateral Unilateral na Polia Média.mp4',
        'elevacao lateral maquina': 'Elevação Lateral Máquina.mp4',
        'triceps testa na polia alta com corda': 'Tríceps Testa com Corda na Polia Alta.mp4',
        'abdominal maquina': 'Abdominal Máquina.mp4'
    };

    const manualMatch = manualMap[normExercise];
    if (manualMatch && videoFiles.includes(manualMatch)) {
        return manualMatch;
    }

    return null;
}

// Main execution
try {
    const files = fs.readdirSync(videoDir).filter(f => f.toLowerCase().endsWith('.mp4') || f.toLowerCase().endsWith('.mov'));

    let totalSize = 0;
    let matches = [];
    let missing = [];

    const updateSql = [];
    const copyCommands = ['mkdir -p "videos-selected"'];

    console.log(`🔍 Analisando ${exercises.length} exercícios contra ${files.length} vídeos...\n`);

    exercises.forEach(exercise => {
        // Check if we already mapped this exact exercise name (duplicates in seed)
        if (matches.find(m => m.exercise === exercise)) return;

        const match = findBestMatch(exercise, files);

        if (match) {
            const stats = fs.statSync(path.join(videoDir, match));
            totalSize += stats.size;

            // Sanitize filename for Supabase (remove accents, spaces, special chars)
            const ext = path.extname(match);
            const saneName = normalize(path.parse(match).name)
                .replace(/\s+/g, '-') // Replace spaces with hyphens (though normalize removes them, let's be safe if logic changes)
                .replace(/[^a-z0-9]/g, '-') // Keep only alphanumeric and hyphens
                + ext;

            matches.push({ exercise, video: match, saneVideo: saneName, size: stats.size });

            // SQL to update database
            const safeExercise = exercise.replace(/'/g, "''");
            updateSql.push(`UPDATE exercises SET video_filename = '${saneName}' WHERE name = '${safeExercise}';`);

            // Shell command to copy and rename
            copyCommands.push(`cp "${path.join(videoDir, match)}" "videos-selected/${saneName}"`);
        } else {
            missing.push(exercise);
        }
    });

    // Generate Report
    console.log('✅ Mapeamento concluído!\n');
    console.log(`📹 Vídeos encontrados: ${matches.length}`);
    console.log(`💾 Tamanho total necessário: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`⚠️  Vídeos não encontrados: ${missing.length}\n`);

    if (missing.length > 0) {
        console.log('Exercícios sem vídeo:');
        missing.forEach(m => console.log(` - ${m}`));
        console.log('\n');
    }

    // Save files
    fs.writeFileSync(path.join(outputDir, 'update_videos.sql'), updateSql.join('\n'));
    fs.writeFileSync(path.join(outputDir, 'copy_videos.sh'), copyCommands.join('\n'));
    fs.chmodSync(path.join(outputDir, 'copy_videos.sh'), '755');

    console.log('Arquivos gerados:');
    console.log(` - ${path.join(outputDir, 'update_videos.sql')} (Script SQL para atualizar o banco)`);
    console.log(` - ${path.join(outputDir, 'copy_videos.sh')} (Script para copiar os vídeos)`);

} catch (err) {
    console.error('Erro:', err);
}
