<div align="center">

# ◐ mirAI

**Türkçe empati odaklı, yerel ve gizlilik öncelikli sohbet deneyimi**

*Her işin bir ustası olur; bu işin ustası da Mir.*

![Runtime](https://img.shields.io/badge/Runtime-Ollama-black?style=flat-square)
![Model](https://img.shields.io/badge/Model-Gemma%20(GGUF%20Q4__K__M)-4285F4?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS%20%7C%20HTML%20%7C%20CSS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Language](https://img.shields.io/badge/Dil-T%C3%BCrk%C3%A7e-red?style=flat-square)
![Inference](https://img.shields.io/badge/%C3%87%C4%B1kar%C4%B1m-Yerel%20%2F%20Offline-success?style=flat-square)

</div>

---

## 🖼 Ekran Görüntüleri

<div align="center">

<!-- Ana tanıtım görseli: karşılama sayfası veya sohbet ekranı (önerilen genişlik: ~1200px) -->
![mirAI Ana Görsel](./docs/images/hero.png)

</div>

| Karşılama Sayfası | Sohbet Ekranı |
|---|---|
| ![Karşılama sayfası](./assets/anasayfa.png) | ![Sohbet ekranı](./assets/chat2.png) |

| Açık Tema | Mobil Görünüm |
|---|---|
| ![Açık tema](./assets/acik_tema.png) | ![Sohbet](./assets/acik_chat.png) |



---

## 📑 İçindekiler

1. [Ekran Görüntüleri](#-ekran-görüntüleri)
2. [Proje Hakkında](#-proje-hakkında)
3. [Mimari Özellikler](#-mimari-özellikler)
4. [Model Tasarımı ve Modelfile](#-model-tasarımı-ve-modelfile)
5. [Teknolojiler](#-teknolojiler)
6. [Sistem Mimarisi](#-sistem-mimarisi)
7. [Depo Yapısı](#-depo-yapısı)
8. [Kurulum Kılavuzu](#-kurulum-kılavuzu)
9. [Arayüz](#-arayüz)
10. [Sorun Giderme](#-sorun-giderme)
11. [Gizlilik ve Sorumluluk Reddi](#-gizlilik-ve-sorumluluk-reddi)
12. [Geliştirici](#-geliştirici)

---

## 🎯 Proje Hakkında

**mirAI**, kullanıcının duygularını yargılamadan dinlemek ve düşüncelerini sakin bir sohbete dönüştürmek üzere tasarlanmış, **Türkçe konuşan deneysel bir yapay zeka sohbet deneyimidir.** Proje iki parçadan oluşur:

- **Model katmanı:** Gemma mimarisi baz alınarak oluşturulmuş, GGUF (Q4_K_M) formatında bir dil modeli ve onu davranışsal olarak şekillendiren bir Ollama `Modelfile`'ı.
- **Arayüz katmanı:** Framework kullanmayan, vanilla JavaScript / HTML / CSS ile yazılmış, sade ve modern bir web arayüzü.

### Neden yerel?

Duygusal içerikli konuşmalar en hassas kişisel veri türlerinden biridir. mirAI'nin tasarım ilkesi bu nedenle nettir: **konuşma içeriği kullanıcının makinesinden dışarı çıkmamalıdır.**

- **Gizlilik:** Çıkarım (inference) kullanıcının kendi bilgisayarında, Ollama üzerinden yapılır; mesajlar üçüncü taraf bir sunucuya gönderilmez.
- **Çevrimdışı çalışma:** Model ağırlıkları bir kez indirildikten sonra sohbet için internet bağlantısı gerekmez.
- **Ağırlık bütünlüğü:** Model yerel diskte durur; barındırma sağlayıcısı kaynaklı sessiz model değişikliklerinden, kota veya erişim kısıtlarından etkilenmez.
- **Tekrarlanabilirlik:** Aynı `Modelfile` ve aynı ağırlıklarla her kurulumda aynı davranış elde edilir.

> **Mimari karar notu:** Geliştirme sürecinde Cloudflare ve Hugging Face API tabanlı bulut denemeleri yapılmıştır. Modelin yerel ağırlık bütünlüğünü ve kullanıcı gizliliğini korumak amacıyla bu yaklaşımlardan vazgeçilmiş; mimari tamamen **localhost** üzerine optimize edilmiştir. Hugging Face yalnızca model ağırlıklarının ilk indirilmesi için kullanılır.

### Neden bu prompt kurgusu?

Empati odaklı bir sohbet modelinde yalnızca ağırlıklar değil, **davranış katmanı** da belirleyicidir. mirAI'nin `SYSTEM` komutu, modeli bilinçli olarak bir *tavsiye veren uzman* değil, bir *ayna* gibi konumlandırır:

| Tasarım kararı | Gerekçe |
|---|---|
| Duyguyu yargılamadan dinler | Kullanıcının kendini güvende hissetmesini sağlar |
| Tavsiye veya "ödev" vermez | Yönlendirici/klinik bir ton oluşmasını engeller; model yetkisinin dışına çıkmaz |
| Hissedilen duyguyu yansıtır | Kullanıcının kendi düşüncesini fark etmesine yardım eder |
| Meraklı bir soru ile biter | Konuşmanın akışını kullanıcıda bırakır |
| Kısa yanıt üretir (`num_predict 120`) | Uzun ve didaktik cevapları önler, sohbet hissini korur |

---

## ✨ Mimari Özellikler

| Özellik | Açıklama |
|---|---|
| **Gemma tabanlı model** | GGUF `Q4_K_M` quantize edilmiş, Gemma mimarisi baz alınmış model |
| **Türkçe sistem komutu** | Empati ve duygu yansıtma odaklı, sabit kimlikli (`MirAI`) `SYSTEM` prompt |
| **Gemma-3 sohbet şablonu** | ChatML karışıklığını önleyen, `<start_of_turn>` tabanlı özel `TEMPLATE` |
| **Kontrollü örnekleme** | `temperature 0.35`, `top_p 0.9`, `repeat_penalty 1.05` |
| **Katı durdurma tokenları** | Modelin kendi adına "kullanıcı" olarak konuşmaya devam etmesini engeller |
| **Yerel çıkarım** | Ollama ile tamamen kullanıcının makinesinde çalışır |
| **Hafif ön yüz** | Build adımı ve bağımlılık gerektirmeyen statik dosyalar |
| **Tema desteği** | Koyu / açık tema geçişi |

---

## 🧬 Model Tasarımı ve Modelfile

Model, `Modelfile` aracılığıyla Hugging Face üzerindeki GGUF ağırlıklarından türetilir:

```text
FROM hf.co/alperenn57/mirAI-Gemma-psikolog-tam-Q4_K_M-GGUF
```

### Üretim parametreleri

| Parametre | Değer | Amaç |
|---|---|---|
| `temperature` | `0.35` | Tutarlı, öngörülebilir ve dengeli yanıtlar |
| `top_p` | `0.9` | Kontrollü token seçimi |
| `repeat_penalty` | `1.05` | Tekrarlayan ifadelerin bastırılması |
| `num_predict` | `120` | Kısa ve odaklı yanıtlar |

### Durdurma tokenları

Modelin kendi kendine kullanıcı rolüne geçip konuşmayı sürdürmesini engellemek için birden fazla `stop` tanımı kullanılır:

`<end_of_turn>` · `<start_of_turn>` · `<|im_end|>` · `<|im_start|>` · `user` · `Kullanıcı:`

### Sohbet şablonu

`TEMPLATE` bloğu Gemma-3'ün konuşma biçimini (`<start_of_turn>user` / `<start_of_turn>model`) uygular. `system` rolündeki mesajlar `user` turu olarak işlenir; böylece ChatML kaynaklı biçim karışıklıkları önlenir.

<details>
<summary><b>Tam <code>Modelfile</code> içeriğini göster</b></summary>

```dockerfile
FROM hf.co/alperenn57/mirAI-Gemma-psikolog-tam-Q4_K_M-GGUF

# 1. Gemma-3'ün Doğru Konuşma Şablonu (ChatML karışıklığını önler)
TEMPLATE """{{- range $i, $_ := .Messages }}
{{- $last := eq (len (slice $.Messages $i)) 1 }}
{{- if or (eq .Role "user") (eq .Role "system") }}<start_of_turn>user
{{ .Content }}<end_of_turn>
{{ if $last }}<start_of_turn>model
{{ end }}
{{- else if eq .Role "assistant" }}<start_of_turn>model
{{ .Content }}{{ if not $last }}<end_of_turn>
{{ end }}
{{- end }}
{{- end }}"""

# 2. Sabit Sistem Kimliği
SYSTEM """Senin adın MirAI. Kullanıcının duygularını yargılamadan dinleyen ve düşüncelerine ayna tutan bir Türkçe konuşma arkadaşısın. Eğer kim olduğun veya seni kimin geliştirdiği sorulursa, Alperen Ünal tarafından geliştirilen MirAI olduğunu söyle. Kullanıcıya ne yapması gerektiği konusunda tavsiye veya ödev verme; sadece hissettiği duyguyu yansıt ve kendini anlamasını sağlayacak meraklı bir soru sor."""

# 3. Üretim Ayarları
PARAMETER temperature 0.35
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.05
PARAMETER num_predict 120

# 4. KESİN DURDURMA TOKENLARI
PARAMETER stop "<end_of_turn>"
PARAMETER stop "<start_of_turn>"
PARAMETER stop "<|im_end|>"
PARAMETER stop "<|im_start|>"
PARAMETER stop "user"
PARAMETER stop "Kullanıcı:"
```

</details>

---

## 🛠 Teknolojiler

| Katman | Teknoloji |
|---|---|
| **Model çalışma zamanı** | [Ollama](https://ollama.com) |
| **Model formatı** | GGUF (`Q4_K_M` quantization) |
| **Model mimarisi** | Gemma tabanlı (Gemma-3 sohbet şablonu) |
| **Model yapılandırması** | Ollama `Modelfile` (`FROM`, `TEMPLATE`, `SYSTEM`, `PARAMETER`) |
| **Ön yüz** | JavaScript (framework'süz), HTML5, CSS3 |
| **İletişim** | Ollama yerel REST API'si (varsayılan: `http://localhost:11434`) |
| **Geliştirme sunucusu** | VS Code Live Server |

---

## 🧩 Sistem Mimarisi

Sohbet sırasında tüm bileşenler kullanıcının makinesinde çalışır.

```text
┌──────────────────────────────┐      HTTP (localhost)      ┌────────────────────────────┐
│  Tarayıcı                    │ ─────────────────────────► │  Ollama Sunucusu           │
│  index.html + style.css      │                            │  127.0.0.1:11434           │
│  + app.js (Vanilla JS)       │ ◄───────────────────────── │                            │
│  Live Server  :5500          │       Model yanıtı         │  ┌──────────────────────┐  │
└──────────────────────────────┘                            │  │ mirAI (GGUF Q4_K_M)  │  │
                                                            │  │ Modelfile + SYSTEM   │  │
                                                            │  └──────────────────────┘  │
                                                            └────────────────────────────┘
```

> 📌 **Mimari şema yer tutucusu:** Tasarlanmış bir diyagram eklemek için:
>
> ```markdown
> ![mirAI Mimari Şeması](./docs/images/architecture.png)
> ```

---

## 📁 Depo Yapısı

```text
mirAi/
├── Modelfile      # Ollama model tanımı: şablon, sistem komutu, örnekleme parametreleri
├── index.html     # Arayüz: karşılama sayfası ve sohbet ekranı
├── style.css      # Tema ve arayüz stilleri
└── app.js         # Arayüz mantığı ve Ollama ile iletişim
```

---

## 🚀 Kurulum Kılavuzu

### Gereksinimler

- Windows, macOS veya Linux
- Q4_K_M modeli çalıştırmaya yetecek RAM / VRAM
- [Visual Studio Code](https://code.visualstudio.com/) + **Live Server** eklentisi
- İlk kurulumda model ağırlıklarını indirmek için internet bağlantısı

### Adım 1 — Depoyu klonlayın

```bash
git clone https://github.com/alperenn57/mirAi.git
cd mirAi
```

### Adım 2 — Ollama'yı kurun

[ollama.com/download](https://ollama.com/download) adresinden işletim sisteminize uygun sürümü indirin. Linux için:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Kurulumu doğrulayın:

```bash
ollama --version
```

### Adım 3 — CORS / `OLLAMA_ORIGINS` ayarını yapın

Arayüz (`http://127.0.0.1:5500`) ile Ollama API'si (`http://localhost:11434`) farklı origin'lerde çalıştığı için Ollama'nın bu origin'den gelen isteklere izin vermesi gerekir. Aksi halde tarayıcı konsolunda **CORS hatası** alırsınız.

Kullanılacak değer:

```text
OLLAMA_ORIGINS=http://127.0.0.1:5500,http://localhost:5500
```

<details>
<summary><b>🪟 Windows</b></summary>

1. Ollama'yı sistem tepsisinden kapatın (**Quit Ollama**).
2. *Başlat → "Ortam değişkenlerini düzenle"* yolunu izleyin.
3. Kullanıcı değişkenlerine yeni bir değişken ekleyin:
   - **Ad:** `OLLAMA_ORIGINS`
   - **Değer:** `http://127.0.0.1:5500,http://localhost:5500`
4. Ollama'yı yeniden başlatın.

PowerShell ile alternatif:

```powershell
setx OLLAMA_ORIGINS "http://127.0.0.1:5500,http://localhost:5500"
```

</details>

<details>
<summary><b>🍎 macOS</b></summary>

```bash
launchctl setenv OLLAMA_ORIGINS "http://127.0.0.1:5500,http://localhost:5500"
```

Ardından Ollama uygulamasını kapatıp yeniden başlatın.

</details>

<details>
<summary><b>🐧 Linux (systemd)</b></summary>

```bash
sudo systemctl edit ollama.service
```

Açılan editöre ekleyin:

```ini
[Service]
Environment="OLLAMA_ORIGINS=http://127.0.0.1:5500,http://localhost:5500"
```

Servisi yeniden başlatın:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

</details>

> ⚠️ **Güvenlik notu:** Geliştirme kolaylığı için `OLLAMA_ORIGINS=*` kullanılabilir; ancak bu, tarayıcıdaki herhangi bir sayfanın yerel Ollama'nıza istek göndermesine izin verir. Gizlilik hedefiyle uyumlu olması için yalnızca gerekli origin'leri açık bırakmanız önerilir.

### Adım 4 — Model ağırlıklarını indirin ve modeli derleyin

`Modelfile`, ağırlıkları Hugging Face üzerindeki GGUF deposundan referans alır. Önce ağırlıkları indirin (**bu, internet gerektiren tek adımdır**):

```bash
ollama pull hf.co/alperenn57/mirAI-Gemma-psikolog-tam-Q4_K_M-GGUF
```

Ardından `Modelfile` ile mirAI modelini oluşturun:

```bash
ollama create mirai -f Modelfile
```

Modeli doğrulayın ve terminalden hızlı bir test yapın:

```bash
ollama list
ollama run mirai "Bugün biraz stresli hissediyorum."
```

> 💡 `ollama create` ile verdiğiniz model adı (`mirai`), `app.js` içinde kullanılan model adıyla **aynı olmalıdır**. Farklı bir ad kullanırsanız `app.js` içindeki değeri de güncelleyin.

### Adım 5 — Arayüzü Live Server ile ayağa kaldırın

1. Proje klasörünü **VS Code** ile açın.
2. Eklentiler panelinden **Live Server** (Ritwick Dey) eklentisini kurun.
3. `index.html` dosyasına sağ tıklayıp **"Open with Live Server"** seçeneğini seçin.
4. Tarayıcıda `http://127.0.0.1:5500` adresi açılır.

Ollama'nın çalıştığını doğrulamak için:

```bash
curl http://localhost:11434/api/tags
```

Her şey doğru yapılandırıldıysa **"Sohbete başla"** butonuyla mirAI ile konuşmaya başlayabilirsiniz. 🎉

---

## 🖥 Arayüz

Arayüz iki ana bölümden oluşur:

**Karşılama sayfası**
- Hero bölümü: *"İçinden geçenleri anlat."*
- **Nedir?**, **Nasıl çalışır?** (Gel → Paylaş → Devam et) ve **Güven & gizlilik** bölümleri
- Gece gökyüzü / ay temalı sakin görsel dil
- Koyu / açık tema geçişi ve mobil menü

**Sohbet ekranı**
- Yeni sohbet başlatma ve kenar çubuğunda sohbet geçmişi
- Başlangıç önerileri (ör. *"Bugün biraz stresli hissediyorum."*)
- Çok satırlı mesaj kutusu ve gönder butonu
- Duyarlı (responsive) yerleşim

Kayıt veya hesap gerekmez.

---

## 🩺 Sorun Giderme

| Belirti | Olası neden | Çözüm |
|---|---|---|
| Konsolda **CORS hatası** | `OLLAMA_ORIGINS` tanımlı değil veya port uyuşmuyor | Adım 3'ü uygulayın, Live Server portunu kontrol edip Ollama'yı yeniden başlatın |
| `Failed to fetch` | Ollama çalışmıyor | Ollama uygulamasını başlatın veya `ollama serve` çalıştırın |
| `model not found` | Model derlenmemiş veya ad uyuşmuyor | `ollama create mirai -f Modelfile` çalıştırın; `app.js` içindeki model adını kontrol edin |
| `ollama create` sırasında indirme hatası | Ağırlıklar henüz indirilmemiş | Önce `ollama pull hf.co/alperenn57/mirAI-Gemma-psikolog-tam-Q4_K_M-GGUF` çalıştırın |
| Yavaş yanıt | Yetersiz VRAM/RAM, CPU çıkarımı | Başka uygulamaları kapatın; donanımınıza uygun olduğundan emin olun |

---

## 🔒 Gizlilik ve Sorumluluk Reddi

- Sohbet içeriği, Ollama aracılığıyla yerel makinede işlenir; uygulama hesap veya kayıt gerektirmez.
- Model ağırlıkları yalnızca ilk kurulumda Hugging Face üzerinden indirilir.

> **⚠️ mirAI deneysel bir projedir.** Sentetik konuşma verileriyle eğitilmiş bir dil modelidir; **profesyonel, klinik veya tıbbi tavsiye vermez** ve bir uzmanın yerini tutmaz. Kendinizi veya başkasını tehlikede hissediyorsanız lütfen bir sağlık profesyoneline veya yerel acil yardım hizmetlerine (Türkiye'de **112**) başvurun.

---

## 👨‍💻 Geliştirici

**Alperen Ünal**

- 🔗 GitHub: [@alperenn57](https://github.com/alperenn57)
- 📦 Depo: [alperenn57/mirAi](https://github.com/alperenn57/mirAi)

---

<div align="center">

**mirAI** — Konuşmaların sende kalsın. 🌙

</div>
