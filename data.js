/* Data bilik & otot — Plaza Miologi FKIK Unram
   Deskripsi: Buku Penuntun Praktikum Anatomi Otot Ekstremitas Superior et Inferior 2025/2026 (FKIK Unram).
   Slide: Anatomi Blok 2.2 (Muhammad Andi Andrian).
   O-I-A-I: diringkas dari Moore & Dalley, Clinically Oriented Anatomy (7th ed.) dan Netter Atlas. */
window.MIO = (function () {
  // [nama, deskripsi penuntun, origo, insersio, aksi, inervasi]
  const M = (n, d, o, i, a, v) => ({ n, d, o, i, a, v });

  const booths = [
    /* ================= KLASTER PENGANTAR ================= */
    {
      id: "pengantar", cl: "intro", t: "Gerbang Miologi", s: "Outline & prinsip O-I-A-I",
      slides: ["A01", "A02", "A03", "A04", "A17"], reg: "all",
      intro: "Setiap otot dipelajari dengan empat pertanyaan: dari mana ia mulai (Origo), di mana ia berakhir (Insersio), sendi apa yang dilewati dan ke arah mana ia menarik (Aksi), serta saraf apa yang mengontrolnya (Inervasi).",
      m: []
    },
    {
      id: "tatatertib", cl: "intro", t: "Tata Tertib Lab", s: "Sebelum, selama, setelah praktikum",
      slides: ["P05", "P06"], reg: "none",
      intro: "Preparat, tulang, dan kadaver berasal dari tubuh manusia: tidak boleh dirusak dan dipermainkan. Gunakan hanya pinset anatomis, masker, dan handscoen. Dilarang makan, minum, membuat kegaduhan, dan mengambil dokumentasi di ruang praktikum.",
      m: []
    },
    {
      id: "visimisi", cl: "intro", t: "Visi & Misi FKIK", s: "Fakultas & Prodi Pendidikan Dokter",
      slides: ["P01", "P02", "P03", "P04"], reg: "none",
      intro: "Menjadi institusi pendidikan kedokteran dan kesehatan yang unggul, berdampak dan berdaya saing global dengan kekhasan bidang kepulauan.",
      m: []
    },
    {
      id: "pustaka", cl: "intro", t: "Pustaka & Atlas", s: "Referensi penuntun",
      slides: ["A32", "P21"], reg: "none",
      intro: "Moore & Dalley, Clinically Oriented Anatomy (7th ed.); Netter, Atlas of Human Anatomy; Rohen, Yokochi & Lütjen-Drecoll, Anatomy: A Photographic Atlas (8th ed.); Schünke dkk., Prometheus (Edisi 3, EGC).",
      m: []
    },

    /* ================= EKSTREMITAS SUPERIOR ================= */
    {
      id: "thv", cl: "sup", t: "Regio Thoracalis Ventralis", s: "Otot dinding anterior thorax",
      slides: ["A05", "P07"], reg: "thv", view: "ant",
      m: [
        M("M. pectoralis major", "Otot besar, lebar, berbentuk kipas yang menutupi sebagian besar dinding anterior thorax; superfisial dan membentuk kontur dada depan. Anterior terhadap m. pectoralis minor.",
          "Caput claviculare: ½ medial clavicula. Caput sternocostale: sternum, kartilago costae 1–6, aponeurosis m. obliquus externus abdominis", "Labium laterale sulcus intertubercularis humeri (crista tuberculi majoris)", "Adduksi & rotasi medial humerus; caput claviculare memfleksikan, caput sternocostale mengekstensikan humerus dari posisi fleksi", "N. pectoralis lateralis & medialis (C5–T1)"),
        M("M. pectoralis minor", "Otot pipih, relatif kecil, lebih dalam dari pectoralis major. Membentang dari costae anterior menuju processus coracoideus.",
          "Costae 3–5 dekat kartilago costalis", "Margo medialis & facies superior processus coracoideus scapulae", "Menstabilkan scapula dengan menariknya ke inferior-anterior pada dinding thorax", "N. pectoralis medialis (C8–T1)"),
        M("M. subclavius", "Otot kecil silindris tepat di bawah clavicula, di antara clavicula dan costa pertama.",
          "Perbatasan costa 1 dan kartilago costalisnya", "Facies inferior ⅓ tengah clavicula", "Menambatkan dan menekan clavicula ke bawah", "N. subclavius (C5–C6)"),
        M("M. serratus anterior", "Otot lebar dan pipih pada dinding lateral thorax; digitasi seperti gigi gergaji melekat pada costae, berjalan ke permukaan anterior scapula.",
          "Facies externa bagian lateral costae 1–8", "Facies anterior margo medialis scapulae", "Protraksi scapula dan menahannya pada dinding thorax; rotasi scapula ke atas (abduksi lengan >90°)", "N. thoracicus longus (C5–C7)")
      ]
    },
    {
      id: "thd", cl: "sup", t: "Regio Thoracalis Dorsalis", s: "Otot punggung superfisial & rotator cuff",
      slides: ["A06", "A07", "P07", "P08"], reg: "thd", view: "post",
      m: [
        M("M. trapezius", "Otot lebar berbentuk segitiga di posterior leher dan thorax atas; kedua sisi membentuk trapesium. Otot superfisial utama regio dorsal atas.",
          "⅓ medial linea nuchalis superior, protuberantia occipitalis externa, ligamentum nuchae, processus spinosus C7–T12", "⅓ lateral clavicula, acromion, spina scapulae", "Pars descendens elevasi; pars transversa retraksi; pars ascendens depresi scapula; bersama: rotasi scapula ke atas", "N. accessorius (CN XI) motorik; C3–C4 proprioseptif"),
        M("M. latissimus dorsi", "Otot sangat lebar, pipih, berbentuk kipas yang menutupi bagian inferior dan lateral punggung.",
          "Processus spinosus T7–T12, fascia thoracolumbalis, crista iliaca, costae 3–4 terbawah", "Dasar sulcus intertubercularis humeri", "Ekstensi, adduksi, dan rotasi medial humerus; mengangkat tubuh saat memanjat", "N. thoracodorsalis (C6–C8)"),
        M("M. levator scapulae", "Otot memanjang seperti tali di posterolateral leher, dari vertebra cervicalis ke scapula; lebih dalam dari trapezius.",
          "Tuberculum posterius processus transversus C1–C4", "Margo medialis scapulae di atas pangkal spina scapulae", "Elevasi scapula dan rotasi ke bawah (memiringkan cavitas glenoidalis ke inferior)", "N. dorsalis scapulae (C5) dan nn. cervicales (C3–C4)"),
        M("M. rhomboideus minor", "Otot kecil berbentuk pita, dalam terhadap trapezius, di antara columna vertebralis dan scapula bagian superior; superior dari rhomboideus major.",
          "Ligamentum nuchae, processus spinosus C7–T1", "Margo medialis scapulae setinggi pangkal spina scapulae", "Retraksi dan rotasi scapula ke bawah; memfiksasi scapula ke dinding thorax", "N. dorsalis scapulae (C4–C5)"),
        M("M. rhomboideus major", "Otot lebar, pipih, segiempat; di bawah trapezius, antara columna vertebralis dan scapula, inferior dari rhomboideus minor.",
          "Processus spinosus T2–T5", "Margo medialis scapulae dari spina hingga angulus inferior", "Retraksi dan rotasi scapula ke bawah; memfiksasi scapula ke dinding thorax", "N. dorsalis scapulae (C4–C5)"),
        M("M. deltoideus", "Otot berbentuk delta: lebar di superior dan mengecil ke inferior. Membentuk kontur bulat bahu dan menutupi sisi lateral articulatio humeri.",
          "⅓ lateral clavicula, acromion, spina scapulae", "Tuberositas deltoidea humeri", "Pars clavicularis: fleksi & rotasi medial; pars acromialis: abduksi 15–90°; pars spinalis: ekstensi & rotasi lateral lengan", "N. axillaris (C5–C6)"),
        M("M. supraspinatus", "Otot memanjang, relatif tebal, mengisi fossa supraspinata; superior terhadap spina scapulae, sebagian tertutup trapezius dan deltoideus.",
          "Fossa supraspinata scapulae", "Facies superior tuberculum majus humeri", "Memulai abduksi lengan (0–15°) dan bekerja dengan rotator cuff menstabilkan caput humeri", "N. suprascapularis (C4–C6)"),
        M("M. infraspinatus", "Otot segitiga yang mengisi sebagian besar fossa infraspinata; inferior terhadap spina scapulae, sebagian ditutupi deltoideus.",
          "Fossa infraspinata scapulae", "Facies media tuberculum majus humeri", "Rotasi lateral lengan; bagian rotator cuff", "N. suprascapularis (C5–C6)"),
        M("M. subscapularis", "Otot lebar segitiga yang mengisi hampir seluruh fossa subscapularis di permukaan anterior scapula, di antara scapula dan dinding thorax.",
          "Fossa subscapularis (facies anterior scapulae)", "Tuberculum minus humeri", "Rotasi medial dan adduksi lengan; bagian rotator cuff", "N. subscapularis superior & inferior (C5–C7)"),
        M("M. teres minor", "Otot kecil, memanjang, relatif silindris di sisi lateral scapula; inferior dari infraspinatus dan superior dari teres major.",
          "Bagian tengah margo lateralis scapulae", "Facies inferior tuberculum majus humeri", "Rotasi lateral lengan; bagian rotator cuff", "N. axillaris (C5–C6)"),
        M("M. teres major", "Otot tebal dan memanjang pada bagian inferolateral scapula; inferior dari teres minor dan membentuk dinding posterior axilla.",
          "Facies posterior angulus inferior scapulae", "Labium mediale sulcus intertubercularis humeri", "Adduksi dan rotasi medial lengan", "N. subscapularis inferior (C5–C7)")
      ]
    },
    {
      id: "brv", cl: "sup", t: "Regio Brachii Ventralis", s: "Kompartemen anterior lengan atas",
      slides: ["A08", "P08"], reg: "brv", view: "ant",
      m: [
        M("M. biceps brachii", "Otot besar fusiform di anterior lengan atas; dua caput (longum & breve) bergabung menjadi satu massa otot di tengah lengan, superfisial.",
          "Caput breve: ujung processus coracoideus. Caput longum: tuberculum supraglenoidale scapulae", "Tuberositas radii dan fascia antebrachii melalui aponeurosis bicipitalis", "Supinasi lengan bawah dan fleksi siku saat tersupinasi; caput breve membantu fleksi bahu", "N. musculocutaneus (C5–C7)"),
        M("M. coracobrachialis", "Otot memanjang dan ramping di anteromedial lengan atas, dari processus coracoideus menuju humerus; medial terhadap bagian proksimal biceps.",
          "Ujung processus coracoideus scapulae", "⅓ tengah facies medialis humeri", "Fleksi dan adduksi lengan; menahan caput humeri di cavitas glenoidalis", "N. musculocutaneus (C5–C7)"),
        M("M. brachialis", "Otot lebar dan tebal di anterior distal lengan atas; lebih dalam dari biceps dan menutupi permukaan anterior distal humerus.",
          "½ distal facies anterior humeri", "Processus coronoideus dan tuberositas ulnae", "Fleksor utama siku pada semua posisi lengan bawah", "N. musculocutaneus (C5–C6); sebagian n. radialis"),
      ]
    },
    {
      id: "brd", cl: "sup", t: "Regio Brachii Dorsalis", s: "Kompartemen posterior lengan atas",
      slides: ["A09", "P08"], reg: "brd", view: "post",
      m: [
        M("M. triceps brachii", "Otot besar dan tebal di posterior lengan atas; tiga caput (longum, laterale, mediale) bergabung menjadi satu massa distal dan menempati hampir seluruh regio posterior brachii.",
          "Caput longum: tuberculum infraglenoidale scapulae. Caput laterale: facies posterior humeri di atas sulcus nervi radialis. Caput mediale: facies posterior humeri di bawah sulcus nervi radialis", "Ujung proksimal olecranon ulnae dan fascia antebrachii", "Ekstensor utama siku; caput longum membantu ekstensi dan adduksi lengan serta menstabilkan caput humeri", "N. radialis (C6–C8)")
      ]
    },
    {
      id: "abv", cl: "sup", t: "Regio Antebrachii Ventralis", s: "Fleksor-pronator: superficialis & profundus",
      slides: ["A10", "A11", "P08", "P09"], reg: "abv", view: "ant",
      m: [
        M("M. pronator teres", "Pars superficialis. Otot memanjang dan relatif tebal di proksimal anterior lengan bawah, berjalan oblik dari sisi medial siku ke radius lateral.",
          "Caput humerale: epicondylus medialis humeri. Caput ulnare: processus coronoideus ulnae", "Pertengahan facies lateralis radii (tuberositas pronatoria)", "Pronasi dan fleksi lengan bawah", "N. medianus (C6–C7)"),
        M("M. flexor carpi radialis", "Pars superficialis. Otot fusiform ke arah radial, proksimal berdampingan dengan pronator teres, distal menjadi tendon panjang.",
          "Epicondylus medialis humeri (tendo flexorum communis)", "Basis os metacarpale II", "Fleksi dan abduksi (deviasi radial) tangan pada pergelangan", "N. medianus (C6–C7)"),
        M("M. palmaris longus", "Pars superficialis. Otot panjang ramping dengan tendon superfisial menuju telapak tangan; dapat tidak ditemukan pada sebagian individu.",
          "Epicondylus medialis humeri", "½ distal retinaculum flexorum dan apex aponeurosis palmaris", "Fleksi tangan pada pergelangan dan menegangkan aponeurosis palmaris", "N. medianus (C7–C8)"),
        M("M. flexor carpi ulnaris", "Pars superficialis. Otot panjang dan tebal di sisi ulnar; paling medial dari kelompok fleksor superfisial.",
          "Caput humerale: epicondylus medialis. Caput ulnare: olecranon dan margo posterior ulnae", "Os pisiforme, hamulus ossis hamati, basis os metacarpale V", "Fleksi dan adduksi (deviasi ulnar) tangan pada pergelangan", "N. ulnaris (C7–C8)"),
        M("M. flexor digitorum superficialis", "Pars superficialis (lapisan intermedia). Otot besar dan lebar di tengah lapisan anterior; lebih dalam dari fleksor superfisial lain dan berlanjut menjadi empat tendon.",
          "Caput humeroulnare: epicondylus medialis & processus coronoideus. Caput radiale: ½ superior margo anterior radii", "Corpus phalanx media digiti II–V", "Fleksi phalanx media pada sendi PIP digiti II–V; membantu fleksi MCP dan pergelangan", "N. medianus (C7–T1)"),
        M("M. flexor digitorum profundus", "Pars profundus. Otot besar di lapisan dalam; menempati sebagian besar permukaan anterior ulna dan menjadi tendon menuju jari-jari.",
          "¾ proksimal facies medialis & anterior ulnae dan membrana interossea", "Basis phalanx distalis digiti II–V", "Fleksi phalanx distal pada sendi DIP digiti II–V; membantu fleksi pergelangan", "Bagian medial: n. ulnaris (C8–T1); bagian lateral: n. interosseus anterior (n. medianus)"),
        M("M. flexor pollicis longus", "Pars profundus. Otot panjang dan sempit di sisi radial lapisan profunda, sepanjang radius, menjadi tendon menuju ibu jari.",
          "Facies anterior radii dan membrana interossea", "Basis phalanx distalis pollicis", "Fleksi phalanx-phalanx ibu jari", "N. interosseus anterior dari n. medianus (C8–T1)"),
        M("M. pronator quadratus", "Pars profundus. Otot pendek, pipih, segiempat di bagian paling distal lapisan profunda; melintang antara radius dan ulna.",
          "¼ distal facies anterior ulnae", "¼ distal facies anterior radii", "Pronasi lengan bawah; mempertahankan radius dan ulna tetap menyatu", "N. interosseus anterior dari n. medianus (C8–T1)")
      ]
    },
    {
      id: "abd", cl: "sup", t: "Regio Antebrachii Dorsalis", s: "Ekstensor-supinator: superficialis & profundus",
      slides: ["A12", "A13", "P09", "P10"], reg: "abd", view: "post",
      m: [
        M("M. brachioradialis", "Pars superficialis. Otot panjang fusiform yang membentuk kontur lateral lengan bawah; terlihat dari anterior maupun lateral.",
          "⅔ proksimal crista supraepicondylaris lateralis humeri", "Facies lateralis ujung distal radius, proksimal processus styloideus", "Fleksi siku, terutama pada posisi midpronasi", "N. radialis (C5–C6)"),
        M("M. extensor carpi radialis longus", "Pars superficialis. Otot panjang dan ramping di sisi lateral dorsal, dekat brachioradialis, tendon panjang ke pergelangan.",
          "Crista supraepicondylaris lateralis humeri", "Facies dorsalis basis os metacarpale II", "Ekstensi dan abduksi tangan pada pergelangan", "N. radialis (C6–C7)"),
        M("M. extensor carpi radialis brevis", "Pars superficialis. Lebih pendek dan lebih dalam daripada ECRL, di sisi dorsolateral lengan bawah.",
          "Epicondylus lateralis humeri (tendo extensorum communis)", "Facies dorsalis basis os metacarpale III", "Ekstensi dan abduksi tangan pada pergelangan", "Ramus profundus n. radialis (C7–C8)"),
        M("M. extensor digitorum communis", "Pars superficialis. Otot panjang di sentral dorsal lengan bawah; distal menjadi beberapa tendon menuju jari.",
          "Epicondylus lateralis humeri", "Ekspansi dorsal (extensor hood) digiti II–V", "Ekstensi digiti II–V terutama pada sendi MCP; membantu ekstensi pergelangan", "N. interosseus posterior (C7–C8)"),
        M("M. extensor digiti V (minimi)", "Pars superficialis. Otot kecil memanjang di sisi ulnar kelompok ekstensor, dekat extensor digitorum communis.",
          "Epicondylus lateralis humeri", "Ekspansi dorsal digiti V", "Ekstensi digiti V pada sendi MCP dan IP", "N. interosseus posterior (C7–C8)"),
        M("M. extensor carpi ulnaris", "Pars superficialis. Otot panjang di sisi ulnar dorsal yang membentuk kontur ulnar dorsal lengan bawah.",
          "Epicondylus lateralis humeri dan margo posterior ulnae", "Facies dorsalis basis os metacarpale V", "Ekstensi dan adduksi tangan pada pergelangan", "N. interosseus posterior (C7–C8)"),
        M("M. anconeus", "Pars superficialis. Otot kecil segitiga di posterolateral siku, dekat ujung distal humerus dan proksimal ulna.",
          "Epicondylus lateralis humeri", "Facies lateralis olecranon dan bagian superior facies posterior ulnae", "Membantu triceps mengekstensikan siku; menstabilkan sendi siku; abduksi ulna saat pronasi", "N. radialis (C7–T1)"),
        M("M. supinator", "Pars profundus. Otot lebar dan pendek yang mengelilingi bagian proksimal radius; terletak dalam di posterolateral siku.",
          "Epicondylus lateralis humeri, lig. collaterale radiale & anulare, crista musculi supinatoris ulnae", "Facies lateralis, posterior & anterior ⅓ proksimal radius", "Supinasi lengan bawah", "Ramus profundus n. radialis (C7–C8)"),
        M("M. abductor pollicis longus", "Pars profundus. Otot panjang ramping di sisi radial lapisan profunda dorsal menuju ibu jari.",
          "Facies posterior ½ proksimal ulna, radius, dan membrana interossea", "Basis os metacarpale I (sisi lateral)", "Abduksi ibu jari dan ekstensi pada sendi CMC", "N. interosseus posterior (C7–C8)"),
        M("M. extensor pollicis brevis", "Pars profundus. Otot kecil memanjang di sisi radial dorsal, berdekatan dengan abductor pollicis longus.",
          "Facies posterior ⅓ distal radius dan membrana interossea", "Facies dorsalis basis phalanx proximalis pollicis", "Ekstensi phalanx proksimal ibu jari pada sendi MCP", "N. interosseus posterior (C7–C8)"),
        M("M. extensor pollicis longus", "Pars profundus. Otot panjang sepanjang sisi posterior ulna dengan tendon menuju ibu jari.",
          "Facies posterior ⅓ tengah ulna dan membrana interossea", "Facies dorsalis basis phalanx distalis pollicis", "Ekstensi phalanx distal ibu jari pada sendi MCP dan IP", "N. interosseus posterior (C7–C8)"),
        M("M. extensor indicis (proprius)", "Pars profundus. Otot kecil memanjang di distal profunda dorsal, dekat extensor digitorum, menuju digit II.",
          "Facies posterior ⅓ distal ulna dan membrana interossea", "Ekspansi dorsal digiti II", "Ekstensi digiti II (telunjuk) secara mandiri; membantu ekstensi tangan", "N. interosseus posterior (C7–C8)")
      ]
    },
    {
      id: "manus", cl: "sup", t: "Regio Manus Palmaris", s: "Thenar, hypothenar, lumbricales & interossei",
      slides: ["A14", "A15", "A16", "P10", "P11"], reg: "manus", view: "ant",
      m: [
        M("M. abductor pollicis brevis", "Thenar. Otot pendek, pipih, superfisial; membentuk bagian lateral eminentia thenar.",
          "Retinaculum flexorum, tuberculum ossis scaphoidei & trapezii", "Sisi lateral basis phalanx proximalis pollicis", "Abduksi ibu jari; membantu oposisi", "Ramus recurrens n. medianus (C8–T1)"),
        M("M. flexor pollicis brevis", "Thenar. Otot pendek dan relatif tebal, lebih ke tengah dibanding abductor pollicis brevis.",
          "Retinaculum flexorum dan tuberculum ossis trapezii", "Sisi lateral basis phalanx proximalis pollicis", "Fleksi ibu jari pada sendi MCP", "Caput superficiale: ramus recurrens n. medianus; caput profundum: n. ulnaris"),
        M("M. opponens pollicis", "Thenar. Otot kecil segitiga, lebih dalam di eminentia thenar, sekitar os metacarpale I.",
          "Retinaculum flexorum dan tuberculum ossis trapezii", "Sisi lateral os metacarpale I", "Oposisi ibu jari: menarik metacarpale I ke medial ke tengah telapak dan merotasinya ke medial", "Ramus recurrens n. medianus (C8–T1)"),
        M("M. adductor pollicis", "Otot relatif besar berbentuk kipas di bagian dalam telapak; lebih dalam dari sebagian besar otot thenar.",
          "Caput obliquum: basis os metacarpale II–III, capitatum. Caput transversum: facies anterior corpus os metacarpale III", "Sisi medial basis phalanx proximalis pollicis", "Adduksi ibu jari ke arah lateral jari tengah", "Ramus profundus n. ulnaris (C8–T1)"),
        M("M. abductor digiti V (minimi)", "Hypothenar. Otot memanjang, superfisial, membentuk bagian paling ulnar eminentia hypothenar.",
          "Os pisiforme", "Sisi medial basis phalanx proximalis digiti V", "Abduksi digiti V; membantu fleksi phalanx proksimal", "Ramus profundus n. ulnaris (C8–T1)"),
        M("M. opponens digiti V (minimi)", "Hypothenar. Otot pendek dan relatif tebal, dalam terhadap abductor digiti V, sekitar os metacarpale V.",
          "Hamulus ossis hamati dan retinaculum flexorum", "Margo medialis os metacarpale V", "Menarik metacarpale V ke anterior dan merotasinya, mengoposisikan dengan ibu jari", "Ramus profundus n. ulnaris (C8–T1)"),
        M("M. flexor digiti V brevis", "Hypothenar. Otot kecil dan pendek di eminentia hypothenar, dekat basis digit V.",
          "Hamulus ossis hamati dan retinaculum flexorum", "Sisi medial basis phalanx proximalis digiti V", "Fleksi phalanx proksimal digiti V", "Ramus profundus n. ulnaris (C8–T1)"),
        M("Mm. lumbricales I–IV", "Empat otot kecil berbentuk cacing di telapak tangan; tersusun dari radial ke ulnar dan berjalan ke distal di sisi jari.",
          "I–II: sisi lateral dua tendon lateral FDP; III–IV: sisi berdampingan tiga tendon medial FDP", "Sisi lateral ekspansi dorsal digiti II–V", "Fleksi sendi MCP dan ekstensi sendi IP digiti II–V", "I–II: n. medianus; III–IV: ramus profundus n. ulnaris"),
        M("Mm. interossei palmares I–III", "Otot kecil berbentuk pita di ruang intermetacarpal sisi palmar; lebih dalam dari struktur superfisial telapak.",
          "Facies palmaris os metacarpale II, IV, V", "Ekspansi dorsal dan basis phalanx proximalis digiti II, IV, V", "Adduksi jari II, IV, V ke arah garis aksis (jari tengah) — PAD; membantu lumbricales", "Ramus profundus n. ulnaris (C8–T1)"),
        M("Mm. interossei dorsales I–IV", "Otot bipennatus yang mengisi ruang intermetacarpal pada lapisan dalam tangan.",
          "Sisi berdampingan dua os metacarpale (I–V)", "Basis phalanx proximalis dan ekspansi dorsal digiti II–IV", "Abduksi jari II–IV menjauhi garis aksis — DAB; membantu lumbricales", "Ramus profundus n. ulnaris (C8–T1)")
      ]
    },

    /* ================= EKSTREMITAS INFERIOR ================= */
    {
      id: "fa", cl: "inf", t: "Regio Femoralis Anterior", s: "Iliopsoas, sartorius & quadriceps",
      slides: ["A18", "P12"], reg: "fa", view: "ant",
      m: [
        M("M. iliacus", "Otot lebar berbentuk kipas yang mengisi fossa iliaca pada permukaan dalam os ilium; terletak jauh di dalam regio anterior pelvis.",
          "Crista iliaca, fossa iliaca, ala ossis sacri, lig. sacroiliacum anterius", "Tendo m. psoas major, trochanter minor femoris", "Bersama psoas (iliopsoas): fleksor utama sendi panggul; menstabilkan sendi panggul", "N. femoralis (L2–L4)"),
        M("M. psoas major", "Otot panjang, tebal, fusiform di sepanjang sisi columna vertebralis lumbal, menuju pelvis dan paha; terletak sangat dalam.",
          "Processus transversus vertebra lumbal; sisi corpus T12–L5 dan discus intervertebralis", "Trochanter minor femoris", "Fleksi paha pada panggul; fleksi lateral columna lumbal; fleksi tubuh dari posisi berbaring", "Rami anteriores nn. lumbales (L1–L3)"),
        M("M. sartorius", "Otot sangat panjang berbentuk pita, berjalan oblik di anterior paha dari lateral panggul ke medial distal paha.",
          "Spina iliaca anterior superior (SIAS)", "Bagian superior facies medialis tibiae (pes anserinus)", "Fleksi, abduksi, dan rotasi lateral paha pada panggul; fleksi lutut", "N. femoralis (L2–L3)"),
        M("M. rectus femoris", "Otot panjang fusiform di tengah anterior paha; bagian tengah kelompok quadriceps femoris.",
          "Spina iliaca anterior inferior (SIAI) dan ilium di atas acetabulum", "Basis patellae, lalu tuberositas tibiae via lig. patellae", "Ekstensi lutut; satu-satunya caput quadriceps yang juga memfleksikan panggul", "N. femoralis (L2–L4)"),
        M("M. vastus medialis", "Otot lebar di sisi medial paha yang mengelilingi femur distal medial dan membentuk kontur medial di sekitar patella.",
          "Linea intertrochanterica dan labium mediale linea aspera femoris", "Basis patellae dan tuberositas tibiae via lig. patellae", "Ekstensi lutut; serabut obliknya menstabilkan patella", "N. femoralis (L2–L4)"),
        M("M. vastus intermedius", "Otot lebar dan tebal tepat di permukaan anterior femur, lebih dalam dari rectus femoris.",
          "Facies anterior dan lateralis corpus femoris", "Basis patellae dan tuberositas tibiae via lig. patellae", "Ekstensi lutut", "N. femoralis (L2–L4)"),
        M("M. vastus lateralis", "Otot besar dan lebar di sisi lateral anterior paha yang mengelilingi permukaan lateral femur.",
          "Trochanter major dan labium laterale linea aspera femoris", "Basis patellae dan tuberositas tibiae via lig. patellae", "Ekstensi lutut", "N. femoralis (L2–L4)")
      ]
    },
    {
      id: "fam", cl: "inf", t: "Regio Femoralis Anteromedial", s: "Kelompok adduktor paha",
      slides: ["A19", "P12", "P13"], reg: "fam", view: "ant",
      m: [
        M("M. pectineus", "Otot pendek, pipih, segiempat di proksimal medial paha, dekat daerah inguinal.",
          "Ramus superior ossis pubis (pecten ossis pubis)", "Linea pectinea femoris, di bawah trochanter minor", "Adduksi dan fleksi paha; membantu rotasi medial", "N. femoralis (L2–L3); kadang cabang n. obturatorius"),
        M("M. adductor longus", "Otot segitiga, sempit di proksimal dan melebar di distal; superfisial pada kelompok adduktor.",
          "Corpus ossis pubis di bawah crista pubica", "⅓ tengah linea aspera femoris", "Adduksi paha", "N. obturatorius, divisi anterior (L2–L4)"),
        M("M. adductor brevis", "Otot pendek segitiga, lebih dalam dari adductor longus di proksimal medial paha.",
          "Corpus dan ramus inferior ossis pubis", "Linea pectinea dan bagian proksimal linea aspera", "Adduksi paha; membantu fleksi", "N. obturatorius (L2–L4)"),
        M("M. adductor magnus", "Otot sangat besar dan lebar yang menempati sebagian besar kompartemen medial paha, dari pelvis ke femur distal.",
          "Bagian adduktor: ramus inferior pubis & ramus ischii. Bagian hamstring: tuber ischiadicum", "Tuberositas glutea, linea aspera, linea supracondylaris medialis; tuberculum adductorium", "Adduksi paha; bagian adduktor memfleksikan, bagian hamstring mengekstensikan paha", "Bagian adduktor: n. obturatorius (L2–L4); bagian hamstring: divisi tibialis n. ischiadicus (L4)"),
        M("M. gracilis", "Otot panjang, tipis, berbentuk pita di sisi paling medial paha, berjalan hampir vertikal.",
          "Corpus dan ramus inferior ossis pubis", "Bagian superior facies medialis tibiae (pes anserinus)", "Adduksi paha; fleksi lutut dan membantu rotasi medial tungkai", "N. obturatorius (L2–L3)")
      ]
    },
    {
      id: "glut", cl: "inf", t: "Regio Gluteus", s: "Gluteal & rotator lateral pendek",
      slides: ["A20", "P13"], reg: "glut", view: "post",
      m: [
        M("M. gluteus maximus", "Otot sangat besar, tebal, quadrilateral; lapisan paling superfisial bokong dan membentuk sebagian besar kontur bokong.",
          "Ilium posterior dari linea glutea posterior, facies dorsalis sacrum & coccyx, lig. sacrotuberale", "Sebagian besar ke tractus iliotibialis; sebagian ke tuberositas glutea femoris", "Ekstensi paha (terutama dari posisi fleksi: naik tangga, bangkit duduk); rotasi lateral; menstabilkan lutut via tractus iliotibialis", "N. gluteus inferior (L5–S2)"),
        M("M. gluteus medius", "Otot berbentuk kipas di permukaan lateral os ilium; sebagian besar tertutup gluteus maximus.",
          "Facies externa ilium di antara linea glutea anterior dan posterior", "Facies lateralis trochanter major femoris", "Abduksi dan rotasi medial paha; menjaga pelvis tetap datar saat tungkai lawan terangkat (uji Trendelenburg)", "N. gluteus superior (L5–S1)"),
        M("M. gluteus minimus", "Otot kecil berbentuk kipas, lebih dalam dari gluteus medius di permukaan lateral os ilium.",
          "Facies externa ilium di antara linea glutea anterior dan inferior", "Facies anterior trochanter major femoris", "Abduksi dan rotasi medial paha; menstabilkan pelvis", "N. gluteus superior (L5–S1)"),
        M("M. tensor fasciae latae", "Otot kecil memanjang dan fusiform di anterolateral panggul, berhubungan erat dengan fascia lata.",
          "Spina iliaca anterior superior dan bagian anterior crista iliaca", "Tractus iliotibialis yang melekat pada condylus lateralis tibiae (tuberculum Gerdy)", "Abduksi, rotasi medial, dan fleksi paha; menegangkan fascia lata dan menstabilkan lutut ekstensi", "N. gluteus superior (L5–S1)"),
        M("M. piriformis", "Otot berbentuk piramida/kipas kecil dari sacrum yang berjalan lateral ke femur; terletak dalam di regio gluteal.",
          "Facies anterior sacrum (S2–S4) dan lig. sacrotuberale", "Margo superior trochanter major femoris", "Rotasi lateral paha yang ekstensi, abduksi paha yang fleksi; menstabilkan caput femoris", "Rami anteriores S1–S2"),
        M("M. gemellus superior", "Otot kecil pendek berbentuk pita, dalam di regio gluteal, superior terhadap tendon obturator internus.",
          "Facies posterior spina ischiadica", "Bersama tendo obturator internus ke facies medialis trochanter major (fossa trochanterica)", "Rotasi lateral paha ekstensi, abduksi paha fleksi; menstabilkan caput femoris", "N. ke m. obturator internus (L5–S1)"),
        M("M. obturator internus", "Otot lebar dan pipih yang melapisi permukaan dalam membrana obturatoria dan dinding lateral pelvis.",
          "Facies pelvica membrana obturatoria dan tulang sekitarnya", "Facies medialis trochanter major (fossa trochanterica)", "Rotasi lateral paha ekstensi, abduksi paha fleksi; menstabilkan caput femoris", "N. ke m. obturator internus (L5–S1)"),
        M("M. gemellus inferior", "Otot kecil pendek, inferior terhadap tendon obturator internus, di regio gluteal.",
          "Tuber ischiadicum (bagian superior)", "Bersama tendo obturator internus ke fossa trochanterica", "Rotasi lateral paha ekstensi, abduksi paha fleksi; menstabilkan caput femoris", "N. ke m. quadratus femoris (L5–S1)"),
        M("M. obturator externus", "Otot berbentuk kipas di permukaan luar membrana obturatoria dan sekitar foramen obturatum, di regio medial paha.",
          "Margo foramen obturatum dan facies externa membrana obturatoria", "Fossa trochanterica femoris", "Rotasi lateral paha; menstabilkan caput femoris di acetabulum", "N. obturatorius (L3–L4)"),
        M("M. quadratus femoris", "Otot pendek, tebal, segiempat di regio gluteal bagian inferior.",
          "Margo lateralis tuber ischiadicum", "Tuberculum quadratum pada crista intertrochanterica femoris", "Rotasi lateral paha; menstabilkan caput femoris di acetabulum", "N. ke m. quadratus femoris (L5–S1)")
      ]
    },
    {
      id: "fp", cl: "inf", t: "Regio Femoralis Posterior", s: "Hamstring",
      slides: ["A21", "A22", "P13", "P14"], reg: "fp", view: "post",
      m: [
        M("M. biceps femoris — caput longum", "Bagian panjang biceps femoris; fusiform dan memanjang di posterolateral paha, relatif superfisial.",
          "Tuber ischiadicum", "Sisi lateral caput fibulae", "Fleksi lutut dan rotasi lateral tungkai saat lutut fleksi; ekstensi paha", "Divisi tibialis n. ischiadicus (L5–S2)"),
        M("M. biceps femoris — caput breve", "Bagian lebih pendek dan lebih dalam dibanding caput longum, di posterolateral paha.",
          "Labium laterale linea aspera dan linea supracondylaris lateralis femoris", "Sisi lateral caput fibulae (bersama caput longum)", "Fleksi lutut dan rotasi lateral tungkai", "Divisi fibularis communis n. ischiadicus (L5–S2)"),
        M("M. semitendinosus", "Otot panjang dengan tendon distal panjang dan tipis, di posteromedial paha.",
          "Tuber ischiadicum", "Facies medialis bagian superior tibiae (pes anserinus)", "Ekstensi paha; fleksi lutut dan rotasi medial tungkai saat lutut fleksi", "Divisi tibialis n. ischiadicus (L5–S2)"),
        M("M. semimembranosus", "Otot lebih lebar dan pipih dari semitendinosus, lebih dalam di posteromedial paha.",
          "Tuber ischiadicum", "Bagian posterior condylus medialis tibiae; refleksinya membentuk lig. popliteum obliquum", "Ekstensi paha; fleksi lutut dan rotasi medial tungkai saat lutut fleksi", "Divisi tibialis n. ischiadicus (L5–S2)")
      ]
    },
    {
      id: "ca", cl: "inf", t: "Regio Cruris Anterior", s: "Dorsofleksor pergelangan kaki",
      slides: ["A23", "P14"], reg: "ca", view: "ant",
      m: [
        M("M. tibialis anterior", "Otot panjang dan relatif tebal di anterolateral tibia; otot superfisial utama regio cruris anterior.",
          "Condylus lateralis dan ½ superior facies lateralis tibiae, membrana interossea", "Facies medialis & inferior os cuneiforme mediale dan basis os metatarsale I", "Dorsofleksi pergelangan kaki dan inversi kaki", "N. fibularis profundus (L4–L5)"),
        M("M. extensor digitorum longus", "Otot panjang di anterolateral cruris; distal menjadi beberapa tendon menuju jari-jari kaki.",
          "Condylus lateralis tibiae, ¾ superior facies medialis fibulae, membrana interossea", "Phalanx media dan distalis digiti II–V", "Ekstensi digiti II–V dan dorsofleksi pergelangan kaki", "N. fibularis profundus (L5–S1)"),
        M("M. extensor hallucis longus", "Otot panjang dan sempit di antara tibialis anterior dan extensor digitorum longus, lebih dalam, dengan tendon ke hallux.",
          "Bagian tengah facies anterior fibulae dan membrana interossea", "Facies dorsalis basis phalanx distalis hallucis", "Ekstensi hallux dan dorsofleksi pergelangan kaki", "N. fibularis profundus (L5–S1)"),
        M("M. fibularis (peroneus) tertius", "Otot kecil memanjang di anterolateral distal cruris.",
          "⅓ inferior facies anterior fibulae dan membrana interossea", "Dorsum basis os metatarsale V", "Dorsofleksi pergelangan kaki dan membantu eversi kaki", "N. fibularis profundus (L5–S1)")
      ]
    },
    {
      id: "cl", cl: "inf", t: "Regio Cruris Lateralis", s: "Kelompok fibularis (peroneus)",
      slides: ["A24", "P14"], reg: "cl", view: "lat",
      m: [
        M("M. fibularis (peroneus) longus", "Otot panjang di sisi lateral cruris; proksimal cukup besar dan superfisial, tendonnya berjalan di sekitar regio lateral pergelangan kaki.",
          "Caput fibulae dan ⅔ superior facies lateralis fibulae", "Basis os metatarsale I dan os cuneiforme mediale (melintas plantar)", "Eversi kaki dan plantarfleksi lemah pergelangan; menopang arcus transversus", "N. fibularis superficialis (L5–S2)"),
        M("M. fibularis (peroneus) brevis", "Lebih pendek dan lebih dalam daripada peroneus longus, di sisi lateral fibula.",
          "⅔ inferior facies lateralis fibulae", "Facies dorsalis tuberositas basis os metatarsale V", "Eversi kaki dan plantarfleksi lemah pergelangan", "N. fibularis superficialis (L5–S2)")
      ]
    },
    {
      id: "cp", cl: "inf", t: "Regio Cruris Posterior", s: "Triceps surae & fleksor profundus",
      slides: ["A25", "A26", "P14", "P15"], reg: "cp", view: "post",
      m: [
        M("M. gastrocnemius — caput mediale", "Bagian medial gastrocnemius yang besar dan menonjol di posterior tungkai; membentuk sisi utama kontur betis.",
          "Facies poplitea femoris di atas condylus medialis", "Facies posterior calcaneus via tendo calcaneus (Achilles)", "Plantarfleksi pergelangan kaki saat lutut ekstensi; fleksi lutut", "N. tibialis (S1–S2)"),
        M("M. gastrocnemius — caput laterale", "Bagian lateral gastrocnemius yang besar dan membulat di posterolateral cruris.",
          "Facies lateralis condylus lateralis femoris", "Facies posterior calcaneus via tendo calcaneus", "Plantarfleksi pergelangan kaki saat lutut ekstensi; fleksi lutut", "N. tibialis (S1–S2)"),
        M("M. soleus", "Otot lebar dan tebal, dalam terhadap gastrocnemius; menempati sebagian besar posterior cruris.",
          "Facies posterior caput & ¼ superior fibula, linea musculi solei & margo medialis tibiae", "Facies posterior calcaneus via tendo calcaneus", "Plantarfleksi pergelangan kaki tanpa bergantung posisi lutut; menstabilkan tungkai di atas kaki", "N. tibialis (S1–S2)"),
        M("M. plantaris", "Otot kecil: perut otot pendek dengan tendon distal sangat panjang dan tipis, di antara gastrocnemius dan soleus.",
          "Ujung inferior linea supracondylaris lateralis femoris, lig. popliteum obliquum", "Facies posterior calcaneus via tendo calcaneus", "Membantu gastrocnemius secara lemah (plantarfleksi, fleksi lutut)", "N. tibialis (S1–S2)"),
        M("M. popliteus", "Otot kecil dan pipih di posterior sendi lutut; mengisi dasar fossa poplitea dan terletak relatif dalam.",
          "Facies lateralis condylus lateralis femoris dan meniscus lateralis", "Facies posterior tibiae di atas linea musculi solei", "Fleksi lemah lutut dan 'membuka kunci' lutut (rotasi lateral femur pada tibia terfiksasi)", "N. tibialis (L4–S1)"),
        M("M. flexor digitorum longus", "Otot panjang di posteromedial cruris; distal menjadi tendon ke telapak kaki dan jari.",
          "Bagian medial facies posterior tibiae di bawah linea musculi solei", "Basis phalanx distalis digiti II–V", "Fleksi digiti II–V; plantarfleksi pergelangan; menopang arcus longitudinalis", "N. tibialis (S2–S3)"),
        M("M. tibialis posterior", "Otot panjang dan dalam di antara flexor digitorum longus dan flexor hallucis longus; lapisan profunda posterior cruris.",
          "Membrana interossea, facies posterior tibiae di bawah linea musculi solei, facies posterior fibulae", "Tuberositas ossis navicularis, cuneiformia, cuboideum, basis os metatarsale II–IV", "Plantarfleksi pergelangan dan inversi kaki; menopang arcus longitudinalis medialis", "N. tibialis (L4–L5)"),
        M("M. flexor hallucis longus", "Otot panjang di posterolateral profunda cruris, terutama sepanjang fibula, dengan tendon ke hallux.",
          "⅔ inferior facies posterior fibulae dan bagian inferior membrana interossea", "Basis phalanx distalis hallucis", "Fleksi hallux pada semua sendinya; plantarfleksi lemah; menopang arcus longitudinalis medialis", "N. tibialis (S2–S3)")
      ]
    },
    {
      id: "dp", cl: "inf", t: "Regio Dorsum Pedis", s: "Otot intrinsik punggung kaki",
      slides: ["A27", "P15"], reg: "dp", view: "ant",
      m: [
        M("M. extensor digitorum brevis", "Otot pendek dan pipih di permukaan dorsal kaki; di proksimal dorsum pedis, menghasilkan tendon ke jari-jari kaki. (Bagian medialnya disebut m. extensor hallucis brevis.)",
          "Facies superolateralis calcaneus, lig. talocalcaneum interosseum, retinaculum musculorum extensorum inferius", "Tendon extensor digitorum longus digiti II–IV; bagian medial ke basis phalanx proximalis hallucis", "Membantu ekstensi digiti I–IV pada sendi MTP dan IP", "N. fibularis profundus (L5–S1)")
      ]
    },
    {
      id: "pp", cl: "inf", t: "Regio Plantar Pedis", s: "Empat lapisan otot telapak kaki",
      slides: ["A28", "A29", "A30", "A31", "P15", "P16"], reg: "pp", view: "plantar",
      m: [
        M("M. abductor hallucis", "Lapisan I. Otot panjang dan relatif tebal di sisi medial telapak kaki, membentuk massa otot sepanjang tepi medial.",
          "Processus medialis tuber calcanei, retinaculum flexorum, aponeurosis plantaris", "Sisi medial basis phalanx proximalis hallucis", "Abduksi dan fleksi hallux", "N. plantaris medialis (S2–S3)"),
        M("M. flexor digitorum brevis", "Lapisan I. Otot lebar dan tebal, superfisial di tengah telapak kaki dan bercabang ke beberapa jari.",
          "Processus medialis tuber calcanei, aponeurosis plantaris, septum intermusculare", "Kedua sisi phalanx media digiti II–V", "Fleksi digiti II–V", "N. plantaris medialis (S2–S3)"),
        M("M. abductor digiti minimi (pedis)", "Lapisan I. Otot memanjang di sisi lateral telapak kaki yang membentuk sebagian besar massa tepi lateral.",
          "Processus medialis & lateralis tuber calcanei, aponeurosis plantaris", "Sisi lateral basis phalanx proximalis digiti V", "Abduksi dan fleksi digiti V", "N. plantaris lateralis (S2–S3)"),
        M("M. quadratus plantae", "Lapisan II. Otot pendek dan relatif pipih, dalam terhadap flexor digitorum brevis di bagian posterior telapak.",
          "Facies medialis dan margo lateralis facies plantaris calcanei", "Margo posterolateralis tendo flexor digitorum longus", "Membantu FDL memfleksikan digiti II–V dengan meluruskan arah tarikannya", "N. plantaris lateralis (S2–S3)"),
        M("Mm. lumbricales I–IV (pedis)", "Lapisan II. Empat otot kecil berbentuk cacing di antara tendon fleksor, tersusun dari medial ke lateral.",
          "Tendon-tendon flexor digitorum longus", "Sisi medial ekspansi dorsal digiti II–V", "Fleksi phalanx proksimal dan ekstensi phalanx media & distal digiti II–V", "I: n. plantaris medialis; II–IV: n. plantaris lateralis"),
        M("M. flexor hallucis brevis", "Lapisan III. Otot pendek dan tebal di anteromedial telapak kaki, dekat os metatarsale I dan basis hallux; dua caput (mediale & laterale).",
          "Facies plantaris os cuboideum dan cuneiforme laterale", "Kedua sisi basis phalanx proximalis hallucis (dengan ossa sesamoidea)", "Fleksi phalanx proksimal hallux", "N. plantaris medialis (S2–S3)"),
        M("M. adductor hallucis", "Lapisan III. Otot relatif lebar berbentuk kipas di anterior telapak kaki, lebih dalam dan melintang menuju hallux.",
          "Caput obliquum: basis os metatarsale II–IV. Caput transversum: lig. plantaria sendi MTP", "Sisi lateral basis phalanx proximalis hallucis", "Adduksi hallux; membantu mempertahankan arcus transversus", "Ramus profundus n. plantaris lateralis (S2–S3)"),
        M("M. flexor digiti minimi brevis (pedis)", "Lapisan III. Otot kecil dan pendek di sisi lateral anterior telapak, dekat os metatarsale V dan basis digit V.",
          "Basis os metatarsale V", "Basis phalanx proximalis digiti V", "Fleksi phalanx proksimal digiti V", "Ramus superficialis n. plantaris lateralis (S2–S3)"),
        M("Mm. interossei dorsales I–IV (pedis)", "Lapisan IV. Otot kecil bipennatus yang mengisi ruang antar ossa metatarsalia; lapisan paling dalam.",
          "Sisi berdampingan ossa metatarsalia I–V", "I: sisi medial phalanx proksimal digiti II; II–IV: sisi lateral digiti II–IV", "Abduksi digiti II–IV menjauhi garis aksis (digiti II) — DAB; fleksi MTP", "N. plantaris lateralis (S2–S3)"),
        M("Mm. interossei plantares I–III (pedis)", "Lapisan IV. Otot kecil berbentuk pita di sisi plantar metatarsalia; lapisan terdalam.",
          "Basis dan sisi medial os metatarsale III–V", "Sisi medial basis phalanx proximalis digiti III–V", "Adduksi digiti III–V ke arah digiti II — PAD; fleksi MTP dan ekstensi IP", "N. plantaris lateralis (S2–S3)")
      ]
    },

    /* ================= STASIUN BELAJAR ================= */
    {
      id: "lembar", cl: "lab", t: "Lembar Kerja", s: "116 struktur untuk dicentang",
      slides: ["P17", "P18", "P19"], reg: "none", tool: "checklist",
      intro: "Beri tanda √ setelah struktur berhasil diidentifikasi. Paraf divalidasi oleh dosen/asisten praktikum. Centang di aplikasi ini tersimpan di peramban Anda.",
      m: []
    },
    {
      id: "ujian", cl: "lab", t: "Ruang Ujian Praktikum", s: "Latihan: nama otot & regio",
      slides: ["P20", "P21"], reg: "none", tool: "quiz",
      intro: "Format ujian: (a) Apakah nama otot yang ditunjuk? (b) Di manakah regio otot tersebut? Coretan ditoleransi maksimal 3 kali, satu garis lurus.",
      m: []
    }
  ];

  // Lembar kerja (urutan resmi Penuntun hal. 17–19), regio per baris
  const sheet = [];
  const add = (reg, arr) => arr.forEach(n => sheet.push({ reg, n }));
  add("Regio Thoracalis Ventralis", ["m. pectoralis major", "m. pectoralis minor", "m. subclavius", "m. serratus anterior"]);
  add("Regio Thoracalis Dorsalis", ["m. trapezius", "m. latissimus dorsi", "m. levator scapulae", "m. rhomboideus minor", "m. rhomboideus major", "m. deltoideus", "m. supraspinatus", "m. infraspinatus", "m. subscapularis", "m. teres minor", "m. teres major"]);
  add("Regio Brachii Ventralis", ["m. biceps brachii", "m. coracobrachialis", "m. brachialis"]);
  add("Regio Brachii Dorsalis", ["m. triceps brachii"]);
  add("Regio Antebrachii Ventralis – Pars Superficialis", ["m. pronator teres", "m. flexor carpi radialis", "m. palmaris longus", "m. flexor carpi ulnaris", "m. flexor digitorum superficialis"]);
  add("Regio Antebrachii Ventralis – Pars Profundus", ["m. flexor digitorum profundus", "m. flexor pollicis longus", "m. pronator quadratus"]);
  add("Regio Antebrachii Dorsalis – Pars Superficialis", ["m. brachioradialis", "m. extensor carpi radialis longus", "m. extensor carpi radialis brevis", "m. extensor digitorum communis", "m. extensor digiti V", "m. extensor carpi ulnaris", "m. anconeus"]);
  add("Regio Antebrachii Dorsalis – Pars Profundus", ["m. supinator", "m. abductor pollicis longus", "m. extensor pollicis brevis", "m. extensor pollicis longus", "m. extensor indicis proprius"]);
  add("Regio Manus Palmaris – Thenar", ["m. abductor pollicis brevis", "m. flexor pollicis brevis", "m. opponens pollicis", "m. adductor pollicis"]);
  add("Regio Manus Palmaris – Hypothenar", ["m. abductor digiti V", "m. opponens digiti V", "m. flexor digiti V brevis"]);
  add("Regio Manus Palmaris – Lumbricales & Interossei", ["m. lumbricalis I", "m. lumbricalis II", "m. lumbricalis III", "m. lumbricalis IV", "m. interosseus palmaris I", "m. interosseus palmaris II", "m. interosseus palmaris III", "m. interosseus dorsalis I", "m. interosseus dorsalis II", "m. interosseus dorsalis III", "m. interosseus dorsalis IV"]);
  add("Regio Femoralis Anterior", ["m. iliacus", "m. psoas major", "m. sartorius", "m. rectus femoris", "m. vastus medialis", "m. vastus intermedius", "m. vastus lateralis"]);
  add("Regio Femoralis Anteromedial", ["m. pectineus", "m. adductor longus", "m. adductor brevis", "m. adductor magnus", "m. gracilis"]);
  add("Regio Gluteus", ["m. gluteus maximus", "m. gluteus medius", "m. gluteus minimus", "m. tensor fascia lata", "m. piriformis", "m. gemellus superior", "m. obturator internus", "m. gemellus inferior", "m. obturator externus", "m. quadratus femoris"]);
  add("Regio Femoralis Posterior", ["m. biceps femoris – caput longum", "m. biceps femoris – caput brevis", "m. semitendinosus", "m. semimembranosus"]);
  add("Regio Cruris Anterior", ["m. tibialis anterior", "m. extensor digitorum longus", "m. extensor hallucis longus", "m. peroneus tertius"]);
  add("Regio Cruris Lateralis", ["m. peroneus (fibularis) longus", "m. peroneus (fibularis) brevis"]);
  add("Regio Cruris Posterior", ["m. gastrocnemius – caput mediale", "m. gastrocnemius – caput laterale", "m. soleus", "m. plantaris", "m. popliteus", "m. flexor digitorum longus", "m. tibialis posterior", "m. flexor hallucis longus"]);
  add("Regio Dorsum Pedis", ["m. extensor digitorum brevis"]);
  add("Regio Plantar Pedis – Lapisan Pertama", ["m. abductor hallucis", "m. flexor digitorum brevis", "m. abductor digiti minimi"]);
  add("Regio Plantar Pedis – Lapisan Kedua", ["m. quadratus plantae", "m. lumbricalis I", "m. lumbricalis II", "m. lumbricalis III", "m. lumbricalis IV"]);
  add("Regio Plantar Pedis – Lapisan Ketiga", ["m. flexor hallucis brevis", "m. adductor hallucis", "m. flexor digiti minimi brevis"]);
  add("Regio Plantar Pedis – Lapisan Keempat", ["m. interosseus dorsalis I", "m. interosseus dorsalis II", "m. interosseus dorsalis III", "m. interosseus dorsalis IV", "m. interosseus plantaris I", "m. interosseus plantaris II", "m. interosseus plantaris III"]);

  const clusters = {
    intro: { name: "Klaster Pengantar", color: [0.20, 0.52, 0.36], css: "#2f855a" },
    sup: { name: "Klaster Ekstremitas Superior", color: [0.10, 0.45, 0.62], css: "#1a6f9e" },
    inf: { name: "Klaster Ekstremitas Inferior", color: [0.74, 0.36, 0.16], css: "#b85a28" },
    lab: { name: "Stasiun Belajar", color: [0.55, 0.30, 0.55], css: "#8a4d8a" }
  };

  return { booths, sheet, clusters };
})();
