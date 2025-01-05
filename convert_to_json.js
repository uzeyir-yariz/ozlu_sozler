const fs = require('fs');

function metinToJson(dosyaYolu) {
    const lines = fs.readFileSync(dosyaYolu, 'utf-8').split('\n');

    const jsonData = { 
        "dosya_adi": dosyaYolu,
        "olusturulma_tarihi": new Date().toISOString(),
        "sözler": {} 
    };

    let currentCategory = null;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.charAt(0).toUpperCase() != `"`) {
            currentCategory = line;
            jsonData["sözler"][currentCategory] = [];
        } else if (line.includes('"') && line.includes('~')) { 
            try {
                const [yazi, kisi] = line.split('~');
                const temizYazi = yazi.replace(/"/g, '').trim();
                const temizKisi = kisi.trim();

                if (currentCategory) {
                    jsonData["sözler"][currentCategory].push({
                        "yazı": temizYazi,
                        "yazar": temizKisi
                    });
                }
            } catch (error) {
                console.error(`Satır ayrıştırılamadı: ${line}`);
            }
        }
    }

    return jsonData;
}

// Metni JSON'a çevir ve bir dosyaya yaz
const inputDosya = "sozler.txt";
const outputDosya = "sozler.json";

const jsonOutput = metinToJson(inputDosya);

fs.writeFileSync(outputDosya, JSON.stringify(jsonOutput, null, 4), 'utf-8');

console.log(`Dönüşüm tamamlandı! JSON dosyası '${outputDosya}' olarak kaydedildi.`);