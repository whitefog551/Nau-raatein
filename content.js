/* =========================================================================
   CONTENT + CONFIG  —  edit this file only; layout lives in css/ and js/.
   Hinglish writing uses "aap" forms. First-person verbs are kept gender-neutral
   so the sender can be anyone. Change `config.from` to your own sign-off.
   ========================================================================= */
window.NR_CONTENT = {

  config: {
    title: "Nau Raatein, Ek Pyaari Si Dua",
    recipient: "Laxmi Jii",
    from: "Aapka shubhchintak",           // sign-off used on the final card
    // Day 1 of Sharad Navratri 2026 (Sunday, 11 Oct 2026). Format YYYY-MM-DD.
    startDate: "2026-10-11",
    timeZone: "Asia/Kolkata",             // each day unlocks at 12:00 AM in this zone
    // Chapters after the nine nights open once this many days are unlocked.
    gates: { suggestion: 0, portrait: 0, final: 0 },
    // Owner-testing helper: add ?preview=5 to the URL to unlock 5 days. Set false to disable.
    allowPreview: false,
    forcePreview: false,
    // Optional: your WhatsApp number with country code, digits only (e.g. "919876543210").
    // Leave "" to hide the "Send on WhatsApp" button. Nothing is sent until she presses Send in WhatsApp.
    whatsappNumber: "",
    music: { src: "assets/audio/navratri-ambient.wav" },
    portrait: {
      sketch: "assets/img/portrait-sketch.jpg",
      // Optional true-colour original (same crop/aspect ratio as the sketch). If absent, a soft colour wash of the sketch is used.
      colour: "assets/img/portrait-colour.jpg"
    }
  },

  welcome: {
    eyebrow: "Sharad Navratri · 2026",
    kicker: "Laxmi Jii ke liye",
    greeting:
      "Shubh Navratri, Laxmi Jii. Nau raaton, nau roop aur nau chhoti-chhoti duaon ka yeh scrapbook sirf aapke liye banaya gaya hai. " +
      "Har raat 12 baje (IST) ek naya panna khulta hai, isliye jaldi kuch nahi hai. Aaram se, ek-ek din ka lutf uthaiye.",
    button: "Begin Our Navratri Surprise",
    hint: "Music optional hai. Upar ke button se kabhi bhi on ya off kar sakti hain."
  },

  rangoli: {
    title: "Rangoli, Diya aur Maa Durga",
    paragraphs: [
      "Navratri ka matlab hai nau raatein. Ashwin maas ke shukla paksha mein shuru hone wala yeh Sharad Navratri Maa Durga ke nau roop, yaani Navadurga, ki aradhana ka parv hai. " +
      "Parampara ke anusaar yeh nau din shakti, sanyam aur shraddha ke din hain, aur dasven din Vijayadashami manayi jaati hai. Ghar ke dwaar par rangoli is bhaav se banayi jaati hai ki Devi ka swagat sundarta aur shuddh mann se ho.",
      "Diya andhere ko mitane ka nahi, andhere mein bhi bharosa banaye rakhne ka pratik hai. Isi liye is page par rangoli ke beech nau raaton ki pehli roshni jagaiye. Jab saare diye jal jaayein, toh Devi ke is shlok ko ek baar shraddha se padhiye."
    ],
    mantra: {
      text: "Yā Devī sarvabhūteṣu śakti-rūpeṇa saṃsthitā,\nNamas tasyai namas tasyai namas tasyai namo namaḥ.",
      meaning: "Jo Devi sab praniyon mein shakti ke roop mein sthit hain, unhe baar-baar pranam."
    },
    diyaPrompt: "Light the Diyas",
    diyaDone: "Saare diye jal gaye. Maa Durga ki kripa se aapki is Navratri mein roshni, sukoon aur himmat bani rahe.",
    next: "Nau Raaton ki Taraf Chaliye"
  },

  nights: {
    title: "Nau Raatein",
    intro:
      "Har raat ek naya roop, ek naya rang. Jo din khul chuke hain woh kabhi band nahi honge, aur baaki din apne waqt par, raat ke theek 12 baje, khud khulenge.",
    beyondTitle: "Nau raaton ke baad",
  },

  /* ---------------------------------------------------------------------
     NINE DAYS
     colour = the commonly followed colour for the weekday sequence of 2026
     (Navratri begins on a Sunday). Colours vary by community — edit freely.
     ------------------------------------------------------------------- */
  days: [
    {
      n: 1, goddess: "Maa Shailputri", icon: "🏔️",
      theme: "Neev aur Sthirta",
      colour: { name: "Orange", hex: "#F28C28" },
      accent: { main: "#E8872B", soft: "#FFE9D3", deep: "#8A3F0B" },
      facts: [["Vahan", "Nandi (bail)"], ["Haath mein", "Trishul aur kamal"], ["Seekh", "Sthirta"]],
      devotional:
        "Navratri ka pehla din Maa Shailputri ko samarpit hai. 'Shail' ka matlab parvat aur 'putri' ka matlab beti hota hai, yaani Himalaya Raj ki laadli beti. " +
        "Kathaon ke anusaar pichhle janm mein woh Sati thin aur agle janm mein Parvati ya Hemavati ke roop mein Himalaya ke ghar janmi. " +
        "Unka swaroop shaant aur sthir hai: daayein haath mein trishul, baayein haath mein kamal, aur vahan Nandi naam ka bail. " +
        "Isi din ghatasthapana ke saath nau raaton ke vrat aur pooja ki shuruaat hoti hai, aur kai ghar mein jau (jwara) boye jaate hain. " +
        "Kai parampara unhe Muladhara chakra se jodkar dekhti hain, yaani us neev se jis par poora jeevan khada hota hai. " +
        "Shailputri humein yaad dilati hain ki koi bhi yatra jaldi mein shuru nahi hoti. Use ek mazboot neev chahiye: apne vishwas ki, apne iraade ki, aur us sabr ki jo parvat ki tarah chup-chaap tikta hai.",
      personal:
        "Laxmi Jii, is safar ki shuruaat mujhe ek seedhi si baat se karni thi: shukriya. Kuch log zindagi mein itni khamoshi aur itni naram thehrav ke saath maujood hote hain ki unka hona hi ek sukoon ban jaata hai. " +
        "Mujhe aisa mehsoos hota hai ki aap un logon mein se hain. Aapki baaton aur aapke andaaz mein ek aisa thehrav hai jo aas-paas ke shor ko bhi halka kar deta hai. " +
        "Jaise kalash ke neeche mitti mein jau boye jaate hain, waise hi is website mein kuch chhoti-chhoti duaayein boyi gayi hain, bina kisi umeed ya dabav ke, bas is bharose ke saath ki unki khushbu aap tak pahunche. " +
        "Agar yeh sab aapko pasand aaye, toh yehi sabse badi baat hogi. Aur agar thodi der ke liye bhi aapke chehre par woh pyaari si muskurahat aa jaye, toh mehnat mukammal samajhiye.",
      reflection: "Aaj ka sawaal: aap kaun si ek cheez ko apni neev maanti hain, koi aadat, koi rishta ya koi vishwas, jise aap dheere se aur mazboot karna chahengi?",
      dua: "Aapki neev mazboot rahe aur aapke iraade parvat jaise sthir."
    },
    {
      n: 2, goddess: "Maa Brahmacharini", icon: "📿",
      theme: "Tap aur Dhairya",
      colour: { name: "White", hex: "#FFFFFF" },
      accent: { main: "#B79F86", soft: "#FBF6EE", deep: "#5E4B3A" },
      facts: [["Haath mein", "Japa-mala aur kamandalu"], ["Roop", "Shwet vastra, nange pair"], ["Seekh", "Sanyam aur lagan"]],
      devotional:
        "Doosre din ki devi Maa Brahmacharini hain. 'Brahma' ka ek arth tapasya hai aur 'charini' ka arth aacharan karne wali, yaani tap ka paalan karne wali devi. " +
        "Katha ke anusaar Parvati ne Shiv ji ko pati roop mein pane ke liye hazaaron varsh kathin tapasya ki. Kabhi phal-phool par rahin, kabhi sookhe patton par, aur ant mein patte bhi tyag diye, jis wajah se unka ek naam Aparna bhi pada. " +
        "Unka swaroop saumya hai: safed vastra, daayein haath mein japa-mala, baayein haath mein kamandalu, aur unka koi vahan nahi, woh nange pair chalti hui dikhayi jaati hain. " +
        "Kai parampara unhe Svadhisthana chakra se jodti hain. Brahmacharini ka sandesh yeh hai ki sanyam, lagan aur dhairya kisi bhi mushkil lakshya ko mumkin bana dete hain, " +
        "aur sachchi tapasya sirf kasht sehne mein nahi, apne maksad par tike rehne mein hai.",
      personal:
        "Laxmi Jii, aaj ka din mujhe aapki mehnat aur lagan ke baare mein sochne par majboor kar raha hai. Shayad aap khud is baat ko itna mehsoos na karti hon, par door se dekhne wale ko saaf dikhta hai " +
        "ki aap jo kaam apne haath mein leti hain, use poori imaandari se nibhaane ki koshish karti hain. Aaj ke daur mein, jab har cheez ko fataafat chahiye, aisi sabr-bhari koshish bahut khoobsurat lagti hai. " +
        "Mujhe aapki is sanjeedgi ke liye dil se izzat hai. Mera irada aapko kuch sikhane ya samjhane ka nahi hai, bas itna kehna hai ki jab kabhi thakaan mehsoos ho, tab yaad rakhiyega ki dheere chalna bhi chalna hi hota hai. " +
        "Aapki raftaar aapki apni hai aur bilkul theek hai. Dua hai ki aapki har mehnat ko apna mukaam mile aur raaste mein sirf sukoon ke chhote-chhote padav milte rahein.",
      reflection: "Aaj ka sawaal: aisa kaun sa lakshya hai jiske liye aap chupchaap, bina shor kiye, roz thoda-sa kaam kar rahi hain? Kya aaj usse ek chhota sa sammaan dene ka mann hai?",
      dua: "Aapki lagan ko manzil aur aapke sabr ko sukoon mile."
    },
    {
      n: 3, goddess: "Maa Chandraghanta", icon: "🔔",
      theme: "Himmat aur Madhurta",
      colour: { name: "Red", hex: "#C62839" },
      accent: { main: "#C62839", soft: "#FBDDE0", deep: "#6F0F1B" },
      facts: [["Vahan", "Sher / baagh"], ["Visheshta", "Mastak par ghante jaisa ardhchandra"], ["Seekh", "Nirbhayta"]],
      devotional:
        "Teesre din Maa Chandraghanta ki aradhana hoti hai. Unke mastak par ghante ke aakar ka ardhchandra shobhit hai, isi liye unka yeh naam hai. " +
        "Unki chhavi swarnim aur tejasvi hai, unke das haathon mein trishul, gada, talwar, kamandalu jaise astra-shastra hote hain, aur vahan sher ya baagh hai. " +
        "Maanyata hai ki Shiv ji se vivah ke baad Parvati ne yeh roop dharan kiya, ek aisa roop jismein shaanti aur veerta saath-saath hain. " +
        "Kaha jaata hai ki unke ghante ki dhwani se nakaratmak shaktiyaan door hoti hain aur bhakton ko nirbhayta milti hai. Kai parampara unhe Manipura chakra se jodti hain. " +
        "Unki sabse khoobsurat seekh yeh hai ki saahas ka matlab kathorta nahi hota. Asli himmat woh hai jo narmi, madhurta aur saaf mann ke saath bhi khadi reh sake, aur zaroorat padne par poori dridhta se saamne aa sake.",
      personal:
        "Laxmi Jii, Chandraghanta ki baat karte hue mujhe aapki muskurahat yaad aati hai, wahi jo bina shor kiye aas-paas ka mahaul narm kar deti hai. " +
        "Mujhe lagta hai ki aap mein ek aisi himmat hai jo apni baat shaanti se kehna jaanti hai. Har baar awaaz ooncha karna zaroori nahi hota. Kabhi ek sahi lehja, ek thehri hui nazar aur ek sachchi baat hi kaafi hoti hai. " +
        "Aise log kam milte hain jo dusron ka lihaaz bhi rakhein aur apni jagah par bhi tike rahein, aur mujhe yeh khoobi aapke andaaz mein nazar aati hai. " +
        "Agar kabhi dil mein koi ghabrahat ya hichkichahat aaye, toh yeh yaad rakhiyega ki narm hona kamzori nahi hai. Aaj ki meri dua yeh hai ki aapko apne liye bolne ka hausla aur har baat ko apne tareeke se kehne ki azaadi hamesha mile.",
      reflection: "Aaj ka sawaal: kab aapne aakhri baar narmi ke saath apni baat kahi aur phir bhi jo zaroori tha woh keh paayi? Us pal se aap apne baare mein kya seekhti hain?",
      dua: "Aapko himmat bhi mile aur madhur lehja bhi."
    },
    {
      n: 4, goddess: "Maa Kushmanda", icon: "🌞",
      theme: "Muskaan aur Roshni",
      colour: { name: "Royal Blue", hex: "#2D4FA8" },
      accent: { main: "#2D4FA8", soft: "#DDE5F7", deep: "#142B66" },
      facts: [["Bhujayein", "Ashta (aath)"], ["Vahan", "Sher"], ["Seekh", "Sakaratmak urja"]],
      devotional:
        "Chauthe din Maa Kushmanda ka pujan hota hai. Maanyata hai ki jab chaaron taraf andhera tha aur srishti ka koi astitva nahi tha, tab unhone apni halki si muskaan se brahmand ki rachna ki. " +
        "'Ku' ka arth thoda, 'ushma' ka arth urja ya garmahat, aur 'anda' ka arth brahmand roopi ang hai. Unka nivas Surya mandal ke bheetar maana jaata hai, isi liye unke swaroop mein tej aur prakash ki prachurta hai. " +
        "Ashtabhuja Devi ke haathon mein kamandalu, dhanush, baan, kamal, amrit kalash, chakra, gada aur japa-mala hoti hai, aur vahan sher hai. Kai parampara unhe Anahata chakra se jodti hain. " +
        "Unka sandesh yeh hai ki sabse badi rachnaayein bhi ek chhoti si muskaan aur sakaratmak urja se shuru hoti hain, aur swasthya, ujala aur aanand wahin tikte hain jahan mann halka rehta hai.",
      personal:
        "Lailaa Jii, agar kabhi mujhse poocha jaye ki aapko ek shabd mein kaise bayaan karna chahiye, toh shayad mera jawab 'roshni' hi hoga, aur yeh shabd maine soch-samajh kar chuna hai. " +
        "Aapka hona kisi baat-cheet ko, kisi kamre ko, hatta ki ek aam se din ko bhi thoda sa roshan bana deta hai. Kushmanda ne ek muskaan se brahmand rach diya, " +
        "aur mujhe lagta hai ki chhoti muskurahatein bhi dinon ka rukh badal sakti hain. Mujhe is baat ka shukriya kehna tha ki aapne bahut se pal halke aur khushnuma banaye hain, shayad bina yeh jaane ki aapne kitna asar chhoda. " +
        "Meri dua hai ki aapka apna din bhi utna hi roshan rahe jitna aap dusron ke liye banati hain, aur aapko khud ke liye bhi wahi garmahat mile.",
      reflection: "Aaj ka sawaal: aaj kaun si ek chhoti si cheez aapke mann ko halka karti hai, chai, ek gaana, ek baat? Kya aaj uske liye 10 minute nikaal sakti hain?",
      dua: "Aapki muskaan hamesha kayam rahe aur aapke din roshan."
    },
    {
      n: 5, goddess: "Maa Skandamata", icon: "🪷",
      theme: "Mamta aur Sahara",
      colour: { name: "Yellow", hex: "#E0A800" },
      accent: { main: "#D99A00", soft: "#FFF3C4", deep: "#6B4B00" },
      facts: [["Aasan", "Kamal"], ["Goad mein", "Bhagwan Skanda (Kartikeya)"], ["Seekh", "Vatsalya"]],
      devotional:
        "Paanchve din Maa Skandamata ki pooja hoti hai. Woh Bhagwan Kartikeya, yaani Skanda, jinhe Murugan ya Subramanya bhi kaha jaata hai, ki mata hain, aur isi liye unka naam Skandamata pada. " +
        "Unhe Skand ko apni goad mein liye hue roop mein dikhaya jaata hai. Chaar bhujaon wali Devi kamal ke aasan par virajti hain, isi liye unhe Padmasana Devi bhi kehte hain: do haathon mein kamal, ek haath mein Skand aur ek haath abhay mudra mein. " +
        "Unka vahan sher hai. Kartikeya devtaon ke senapati bane aur Tarakasur ke vadh mein agrani rahe. Kai parampara Skandamata ko Vishuddha chakra se jodti hain. " +
        "Unka bhaav vatsalya hai, woh mamta jo apne bachche ko sambhalti bhi hai aur uski himmat bhi banti hai, aur yeh yaad dilati hai ki sachchi shakti sneh se paida hoti hai.",
      personal:
        "Laxmi Jii, Skandamata ki mamta ko samajhne ke liye zaroori nahi ki insaan maa hi ho. Jin logon mein dusron ki parwah karne ka jazba hota hai, unmein ek aisi mamta hoti hai jo rishton ko sambhale rakhti hai. " +
        "Mujhe aisa mehsoos hota hai ki aap apne apnon ke liye aisa hi sahara hain, kabhi ek sunne wali baat ke roop mein, kabhi ek chhoti si salaah ke roop mein, aur kabhi sirf is ehsaas ke roop mein ki aap paas hain. " +
        "Par parwah karne wale ko bhi parwah ki zaroorat hoti hai. Isiliye aaj meri dua hai ki aap apne liye bhi utni hi narmi rakhein jitni aap dusron ke liye rakhti hain. " +
        "Aaram karna, na kehna ya kabhi sirf chup baithna, yeh sab bhi ek tarah ka pyaar hai, aur aap us pyaar ki poori haqdaar hain.",
      reflection: "Aaj ka sawaal: aaj aap kis ki parwah karengi, aur kya aap apni parwah ke liye bhi apne din mein kuch jagah bana sakti hain?",
      dua: "Jitna pyaar aap baantti hain, utna hi aapko lautkar mile."
    },
    {
      n: 6, goddess: "Maa Katyayani", icon: "🗡️",
      theme: "Saahas aur Nyay",
      colour: { name: "Green", hex: "#3F8F5B" },
      accent: { main: "#3F8F5B", soft: "#DDF1E3", deep: "#164A2C" },
      facts: [["Vahan", "Sher"], ["Haath mein", "Talwar aur kamal"], ["Seekh", "Nyay aur saahas"]],
      devotional:
        "Chhathe din Maa Katyayani ki aradhana hoti hai. Katha ke anusaar Maharshi Katyayan ne ghor tapasya karke Devi ko putri roop mein pane ki prarthana ki, aur Devi unke ghar Katyayani naam se prakat huin. " +
        "Mahishasur ke atyachar se devtaon ko mukt karne ke liye unhone yeh veer roop dharan kiya, aur Navratri ki katha mein unhe Mahishasurmardini ke roop mein bhi pooja jaata hai. " +
        "Chaar bhujaon wali Devi ke ek haath mein talwar aur ek mein kamal hai, do haath abhay aur varad mudra mein hain, aur vahan sher hai. " +
        "Shrimad Bhagwat ke anusaar Vrindavan ki gopiyon ne Krishna ko pati roop mein pane ke liye Katyayani vrat kiya tha. Kai parampara unhe Ajna chakra se jodti hain. " +
        "Unka sandesh nyay, saahas aur sahi ke prati nishtha ka hai: sahi ke liye khade hone ke liye krodh nahi, saaf soch aur dridh sankalp chahiye hota hai.",
      personal:
        "Laxmi Jii, Katyayani ka roop mujhe un lamhon ki yaad dilata hai jab insaan ko apne liye ya kisi sahi baat ke liye khade hona padta hai. Aisa karna hamesha aasaan nahi hota, khaaskar tab jab hum doosron ko dukhi nahi karna chahte. " +
        "Par mujhe lagta hai ki apni baat saaf alfaaz mein rakhna bhi ek tarah ki izzat hai, apne liye bhi aur samne wale ke liye bhi. " +
        "Meri dua hai ki jab bhi aap apni baat rakhein, aapko saaf mann aur sahi alfaaz ka saath mile. Aur ek baat aur: aap kabhi bhi mujhse apni rai mein ikhtilaaf rakh sakti hain. " +
        "Mujhe woh bhi achha lagega, kyunki saaf aur sachchi baat hi kisi bhi rishte ki sabse mazboot neev hoti hai. Aapko apne faislon par bharosa karne ka poora haq hai.",
      reflection: "Aaj ka sawaal: aisi kaun si baat hai jo aap kehna chahti hain par abhi tak keh nahi paayi? Aap use kis tareeke se, kis waqt aur kis se kehna chahengi?",
      dua: "Aapko sahi baat kehne ka hausla aur sunne wale ko samajhne ka dil mile."
    },
    {
      n: 7, goddess: "Maa Kalaratri", icon: "🌙",
      theme: "Nirbhayta aur Shubh",
      colour: { name: "Grey", hex: "#6E7480" },
      accent: { main: "#5F6573", soft: "#E6E8EC", deep: "#23262F" },
      facts: [["Vahan", "Gardabh (gadha)"], ["Anya naam", "Shubhankari"], ["Seekh", "Bhay par vijay"]],
      devotional:
        "Saatve din Maa Kalaratri ki pooja hoti hai, jo Durga ka sabse ugra roop maana jaata hai. Unka varn gehra kaala hai, kesh bikhre hue, teen netra, aur gale mein bijli jaisi chamakti mala; vahan gardabh (gadha) hai. " +
        "Unka ek haath abhay mudra mein aur ek varad mudra mein hota hai, jabki baaki haathon mein khadg aur lohe ka kaanta hota hai. " +
        "Isi liye unka ek naam Shubhankari bhi hai, kyunki bhayanak dikhne ke bawajood woh apne bhakton ko hamesha shubh phal deti hain. " +
        "Kathaon mein unhe andhkar, bhay aur agyan ka naash karne wali shakti maana gaya hai. Kai parampara unhe Sahasrara chakra se jodti hain. " +
        "Unka sandesh yeh hai ki jis andhere se hum darte hain, uska saamna karne par hi roshni ki asli keemat samajh aati hai, aur Devi ka ugra roop bhi asal mein bhakton ki raksha ke liye hai.",
      personal:
        "Laxmi Jii, har insaan ke andar kabhi na kabhi koi andhera hota hai: koi chinta, koi thakaan, koi ankahi baat. Aaj ke din ko mujhe isi ehsaas se jodna tha ki aapko aise andheron se kabhi akele nahi guzarna padta. " +
        "Yeh vaada nahi hai ki andhera kabhi nahi aayega, par dua zaroor hai ki jab aaye, tab aapke paas ek diya, ek dost ya ek apna aisa ho jo saath baith sake. " +
        "Aur agar kabhi aapko apni baat kehne mein hichkichahat ho, toh yaad rakhiyega ki sunne wale log hain. " +
        "Aap jo bhi mehsoos karti hain, woh sunne ke laayak hai, aur aapko apni har mushkil ko akele sulajhane ki zimmedaari nahi leni. Aaj raat jab ek diya jalayein, toh use apne liye bhi jalayein.",
      reflection: "Aaj ka sawaal: aisa kaun sa darr ya chinta hai jise aap aaj kisi bharose ke insaan ke saath, ya kagaz par, halka kar sakti hain?",
      dua: "Har andhere mein aapko ek chhota sa diya mile."
    },
    {
      n: 8, goddess: "Maa Mahagauri", icon: "🐚",
      theme: "Shuddhta aur Kshama",
      colour: { name: "Purple", hex: "#7B3FA0" },
      accent: { main: "#7B3FA0", soft: "#EBDDF5", deep: "#3A1550" },
      facts: [["Vahan", "Shwet vrishabh (bail)"], ["Haath mein", "Trishul aur damru"], ["Seekh", "Shuddhta aur kshama"]],
      devotional:
        "Aathve din, jise Durga Ashtami ke naam se bhi jaana jaata hai, Maa Mahagauri ka pujan hota hai. Katha ke anusaar kathin tapasya ke dauran Devi ka sharir dhool aur mitti se kaala pad gaya tha. " +
        "Jab Shiv ji ne prasann hokar Ganga ke jal se unhe snaan karaya, tab unka roop shankh, chandrama aur kunda ke phool jaisa shwet aur ujjwal ho gaya, aur woh Mahagauri kahlayin. " +
        "Unka vahan shwet vrishabh hai, aur chaar haathon mein trishul, damru, abhay aur varad mudra hote hain. " +
        "Maanyata hai ki unki pooja se pichhle kasht aur dosh door hote hain aur mann ko shaanti milti hai. Kai gharon mein Ashtami ya Navami par Kanya Pujan kiya jaata hai, jismein kanyaon ko Devi ka roop maan kar bhojan karaya jaata hai. " +
        "Mahagauri ka sandesh shuddhta, kshama aur us shaanti ka hai jo lambi tapasya ke baad milti hai.",
      personal:
        "Laxmi Jii, Mahagauri ki kahani mujhe yeh sikhati hai ki mushkil waqt guzarne ke baad insaan ko badal kar ujla bana jaata hai. Mujhe aapke saath bitaaye hue lamhon mein ek aisa saaf, nirmal sa ehsaas milta hai, jaise bahut der baad barish ke baad ka aasmaan. " +
        "Aaj ke din par mera ek chhota sa ikraar bhi hai: agar maine kabhi anjaane mein kuch kaha ya kiya ho jo aapko chubha ho, toh uske liye dil se maazrat. Mera irada aapko dukh dene ka kabhi nahi tha. " +
        "Shayad aapko yeh yaad bhi na ho, par mujhe kehna zaroori laga. Aur agar aapke dil mein kisi ke liye koi purana bojh ho, toh meri dua hai ki aap use apni raftaar se, bina kisi dabav ke, halka kar sakein. " +
        "Kshama dena ya maangna dono hi himmat ka kaam hain, aur dono ke baad mann halka hota hai.",
      reflection: "Aaj ka sawaal: aisa kaun sa purana bojh hai jise aap aaj thoda halka kar sakti hain, kisi ko maaf karke, ya khud ko maaf karke?",
      dua: "Aapka mann nirmal aur aapki raahein ujli rahein."
    },
    {
      n: 9, goddess: "Maa Siddhidatri", icon: "✨",
      theme: "Poornata aur Shukraguzari",
      colour: { name: "Peacock Green", hex: "#0B7A75" },
      accent: { main: "#0B7A75", soft: "#D3EFEC", deep: "#053C39" },
      facts: [["Aasan", "Kamal"], ["Haath mein", "Chakra, gada, shankh, kamal"], ["Seekh", "Poornata"]],
      devotional:
        "Navratri ka nauvan din Maa Siddhidatri ko samarpit hai. Maanyata hai ki woh bhakton ko ashta siddhiyaan pradaan karti hain: anima, mahima, garima, laghima, prapti, prakamya, ishitva aur vashitva. " +
        "Devi Puran ke anusaar Shiv ji ne bhi unki kripa se siddhiyaan prapt kiin, aur unke sharir ka ek ardh bhaag Devi ka ho gaya, jisse woh Ardhanarishwar kahlaye. " +
        "Chaar bhujaon wali Devi kamal par virajti hain, aur unke haathon mein chakra, gada, shankh aur kamal hote hain. Navami ko kai parivaar havan, Kanya Pujan aur Ayudha pooja karte hain, aur agle din Vijayadashami (Dussehra) manayi jaati hai. " +
        "Unka sandesh yeh hai ki sadhna ki poorna safalta kewal vishesh shaktiyon mein nahi, balki sampoornata, krutagyta aur sabke kalyan ki bhavna mein hai.",
      personal:
        "Laxmi Jii, nau raaton ka yeh safar aaj poora ho raha hai, aur mere paas kehne ko ab bhi bahut kuch hai, par sabse pehle shukriya. Aapne is scrapbook ke har panne ko waqt diya, aur yeh mere liye bahut badi baat hai. " +
        "Maine in nau dinon mein apni baatein is tarah likhne ki koshish ki ki woh bojh na banein, kuch sachchi baatein, kuch duaayein, aur ek chhoti si muskaan ki umeed. " +
        "Agar inmein se koi ek line bhi aapke dil tak pahunchi ho, toh yeh poori koshish saarthak hai. Aap par kisi jawab ya pratikriya ka koi dabav nahi hai; jo bhi aap mehsoos karein, aapki apni raftaar mein, wahi sahi hai. " +
        "Aage ek chhota sa surprise aapka intezaar kar raha hai, aur uske liye bas thoda sa dhairya aur aapki khushi chahiye.",
      reflection: "Aaj ka sawaal: in nau dinon mein kaun si ek baat ya ek ehsaas aap apne saath lekar jaana chahengi?",
      dua: "Aapke saare achhe sankalp poore hon aur mann mein shukr bana rahe."
    }
  ],

  suggestion: {
    title: "Aapki Pasand, Aapki Baat",
    intro:
      "Yeh hissa bilkul optional hai. Agar aap chahein toh bataiye ki aage kaisa surprise ya kaisi baatein aapko achhi lagengi, ya koi suggestion likh dijiye. Koi jawab dena zaroori nahi hai.",
    preferenceLabel: "Aapko aage kaisa achha lagega?",
    preferences: [
      "Aur dua-bhari baatein",
      "Thodi si shayari",
      "Halki-phulki muskaan",
      "Sukoon bhari music",
      "Bas itna kaafi hai"
    ],
    textLabel: "Koi suggestion ya baat (optional)",
    textPlaceholder: "Yahan likhiye...",
    privacyTitle: "Yeh kahan save hota hai?",
    privacyBody:
      "Jo aap likhengi ya chunengi, woh sirf aapke is browser mein (localStorage) is device par save hota hai. Yeh kisi server par nahi jaata, aur is website ke paas aapka likha hua koi data nahi pahunchta. " +
      "Isliye yeh private ya permanent ki guarantee nahi hai: browser ka data clear karne par ya kisi doosre device/browser par kholne par yeh nahi dikhega. " +
      "Aapki baat tabhi kisi tak jaayegi jab aap khud 'Share' ya 'WhatsApp' dabayengi, aur tab bhi aap apne chune hue app mein Send dabane se pehle use dekh sakti hain.",
    save: "Is device par save karein",
    share: "Share karein",
    whatsapp: "WhatsApp par bhejein",
    copy: "Copy karein",
    clear: "Mita dein",
    saved: "Is device par save ho gaya.",
    cleared: "Mita diya gaya.",
    copied: "Copy ho gaya.",
    noStorage: "Is browser mein save nahi ho paaya (private mode ho sakta hai). Aap 'Copy karein' ka upyog kar sakti hain.",
    next: "Ek Tasveer ki Taraf"
  },

  portrait: {
    title: "Ek Chhoti Si Tasveer",
    intro:
      "Pehle graphite pencil ki lakeerein ubharengi, phir dheere-dheere rang bharenge. Yeh portrait aapki ek tasveer par aadharit hai.",
    caption: "Pencil se rang tak",
    stages: { sketch: "Pencil ki lakeerein…", colour: "Ab rang bhar rahe hain…", done: "Tasveer taiyaar hai." },
    again: "Watch Again",
    final: "See Final Portrait",
    next: "Ab Aakhri Surprise",
    fallbackNote: "Rang abhi sketch par soft wash ke roop mein hai. Asli rangeen tasveer jodne ke liye assets/img/portrait-colour.jpg rakhein."
  },

  final: {
    title: "Ek Khat, Aapke Naam",
    sealLabel: "Khat kholne ke liye dabaiye",
    to: "Laxmi Jii ke liye",
    paragraphs: [
      "Maa Durga ki kripa se aapke jeevan mein shakti, shaanti, swasthya aur sukoon ki roshni sada bani rahe. Jo shakti Shailputri ki neev mein hai, woh aapke iraadon ko mazboot rakhe. " +
        "Jo sanyam Brahmacharini ki tapasya mein hai, woh aapki lagan ko manzil tak pahunchaye. Chandraghanta aapko saahas aur madhurta dein, Kushmanda aapke dinon ko roshan rakhein, " +
        "aur Skandamata ki mamta aapko aur aapke apnon ko hamesha sambhale rakhe.",
      "Katyayani aapko sahi baat par tikne ka hausla dein, Kalaratri har andhere aur dar ko door rakhein, Mahagauri aapke mann ko nirmal aur shaant rakhein, " +
        "aur Siddhidatri aapke saare achhe sankalpon ko poornata dein. Dussehra ke din jab burai par achhai ki jeet manayi jaayegi, toh aapke bheetar ki achhai bhi aur roshan ho.",
      "Laxmi Jii, in nau raaton mein jo kuch bhi likha gaya, woh bina kisi apeksha ke likha gaya hai. Yeh sab ek chhota sa shukriya tha aapki maujoodgi ke liye, " +
        "aur ek dua tha ki aapko hamesha woh izzat, sukoon aur khushi mile jiske aap haqdaar hain. Aap ko jawab dena zaroori nahi, aur agar kabhi dil kare toh ek muskaan hi bahut hai. " +
        "Aapke liye ek chhota sa naam bhi dil mein rakha hai — Eluné. Is naam ka matlab main kisi dictionary se nahi, apni taraf se diye gaye ek khaas ehsaas se jodta hoon; yeh bas aapke liye rakha hua ek narm sa raaz hai. Laxmi Jii, aap jahan bhi hon, khush rahein aur salamat rahein."
    ],
    blessing: "Shubh Navratri aur Vijayadashami ki hardik shubhkaamnayein.",
    close: "Dil se, shukriya ke saath"
  },

  /* ---------------------------------------------------------------------
     EXTRA SURPRISES — add objects here and redeploy. They appear in the
     "Nau raaton ke baad" row and unlock at unlockAt (IST, 12:00 AM by default).
     Static hosting cannot add content by itself; see README.
     ------------------------------------------------------------------- */
  extras: [
    {
      id: "vijayadashami",
      title: "Vijayadashami ki Shubhkaamnayein",
      icon: "🏹",
      unlockAt: "2026-10-20",
      paragraphs: [
        "Laxmi Jii, Vijayadashami ka din yeh yaad dilata hai ki chahe raasta kitna bhi lamba ho, sachchai aur achhai ka rang aakhir mein ubharta hai. Nau raaton ki is dua-yatra ka yeh dasvan din ek vijay ka din hai, kisi dusre par nahi, balki apne hi bheetar ke dar, thakaan aur sandeh par.",
        "Aaj ke din meri dua hai ki aapki raahon mein hamesha roshni rahe, aapke saare achhe sankalp poore hon, aur aapko woh sab mile jo aapke dil ke liye achha ho. Vijayadashami ki dher saari shubhkaamnayein."
      ]
    }
  ]
};
