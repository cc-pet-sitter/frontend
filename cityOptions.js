const cityOptions = {
  Hokkaido: [
    "Sapporo",
    "Hakodate",
    "Asahikawa",
    "Otaru",
    "Muroran",
    "Kitami",
    "Kushiro",
    "Obihiro",
    "Chitose",
    "Tomakomai",
    "Bihoro",
    "Suttsu",
    "Nakashibetsu",
    "Yubari",
    "Engaru",
    "Shiraoi",
    "Iwamizawa",
    "Nakafurano",
    "Tsubetsu",
    "Rishiri",
  ],
  Aomori: [
    "Aomori",
    "Hachinohe",
    "Hirosaki",
    "Towada",
    "Mutsu",
    "Misawa",
    "Goshogawara",
    "Shichinohe",
    "Kuroishi",
    "Oirase",
  ],
  Iwate: [
    "Morioka",
    "Ichinoseki",
    "Kamaishi",
    "Oshu",
    "Hanamaki",
    "Miyako",
    "Tono",
    "Ninohe",
    "Shizukuishi",
    "Yamada",
  ],
  Miyagi: [
    "Sendai",
    "Ishinomaki",
    "Shiogama",
    "Tome",
    "Kurihara",
    "Shiroishi",
    "Zao",
    "Natori",
    "Tagajo",
    "Sakata",
  ],
  Akita: [
    "Akita",
    "Yokote",
    "Noshiro",
    "Kazuno",
    "Daisen",
    "Inaba",
    "Semboku",
    "Mitane",
    "Takanosu",
    "Odate",
  ],
  Yamagata: [
    "Yamagata",
    "Yonezawa",
    "Tendo",
    "Zao",
    "Kaminoyama",
    "Sagae",
    "Murayama",
    "Yamagata",
    "Shinjo",
    "Nanyo",
  ],
  Fukushima: [
    "Fukushima",
    "Koriyama",
    "Aizuwakamatsu",
    "Shirakawa",
    "Kawamata",
    "Ishikawa",
    "Soma",
    "Minamisoma",
    "Nihonmatsu",
    "Tadami",
  ],
  Ibaraki: [
    "Mito",
    "Tsukuba",
    "Hitachi",
    "Kashima",
    "Sakuragawa",
    "Naka",
    "Koga",
    "Hitachiota",
    "Tsuchiura",
    "Oarai",
  ],
  Tochigi: [
    "Utsunomiya",
    "Ashikaga",
    "Nikko",
    "Tama",
    "Tatebayashi",
    "Sano",
    "Nakagawa",
    "Kanuma",
    "Moka",
    "Kuroiso",
  ],
  Gunma: [
    "Maebashi",
    "Takasaki",
    "Isesaki",
    "Kiryu",
    "Tatebayashi",
    "Numata",
    "Ota",
    "Shibukawa",
    "Minakami",
    "Fujioka",
  ],
  Saitama: [
    "Saitama",
    "Kawaguchi",
    "Koshigaya",
    "Omiya",
    "Kasukabe",
    "Urawa",
    "Kawagoe",
    "Higashimatsuyama",
    "Soka",
    "Ageo",
  ],
  Chiba: [
    "Chiba",
    "Narita",
    "Matsudo",
    "Kashiwa",
    "Funabashi",
    "Ichikawa",
    "Sakura",
    "Tateyama",
    "Urayasu",
    "Kamagaya",
  ],
  Tokyo: [
    "Shinjuku",
    "Shibuya",
    "Chiyoda",
    "Setagaya",
    "Ikebukuro",
    "Ota",
    "Toshima",
    "Koto",
    "Bunkyo",
    "Edogawa",
    "Sumida",
    "Chuo",
    "Arakawa",
    "Adachi",
    "Nakano",
    "Suginami",
    "Meguro",
    "Kita",
    "Taito",
  ],
  Kanagawa: [
    "Yokohama",
    "Kawasaki",
    "Sagamihara",
    "Odawara",
    "Yokosuka",
    "Fujisawa",
    "Chigasaki",
    "Zushi",
    "Atsugi",
    "Kamakura",
    "Minamiashigara",
    "Hayama",
    "Totsuka",
    "Hadano",
    "Ebina",
    "Isehara",
    "Miura",
    "Sakae",
    "Kawasaki",
    "Tama",
  ],
  Niigata: [
    "Niigata",
    "Joetsu",
    "Nagaoka",
    "Tsubame",
    "Sanjo",
    "Murakami",
    "Sado",
    "Niitsu",
    "Agano",
    "Kamo",
  ],
  Toyama: [
    "Toyama",
    "Takaoka",
    "Uozu",
    "Fushiki",
    "Imizu",
    "Nanto",
    "Tonami",
    "Kurobe",
    "Shinminato",
    "Kamiichi",
  ],
  Ishikawa: [
    "Kanazawa",
    "Wajima",
    "Tsubata",
    "Nonoichi",
    "Suematsu",
    "Shika",
    "Hakusan",
    "Kaga",
    "Takaoka",
    "Anamizu",
  ],
  Fukui: [
    "Fukui",
    "Sakai",
    "Echizen",
    "Takahama",
    "Ono",
    "Katsuyama",
    "Obama",
    "Sabae",
    "Takefu",
    "Awano",
  ],
  Yamanashi: [
    "Kofu",
    "Fujiyoshida",
    "Minami Alps",
    "Katsunuma",
    "Tomi",
    "Yamanashi",
    "Fujikawaguchiko",
    "Nirasaki",
    "Fujinomiya",
    "Nanbu",
  ],
  Nagano: [
    "Nagano",
    "Matsumoto",
    "Suwa",
    "Shiojiri",
    "Iida",
    "Karuizawa",
    "Ueda",
    "Nagano",
    "Okaya",
    "Azumino",
  ],
  Gifu: [
    "Gifu",
    "Takayama",
    "Ogaki",
    "Kakamigahara",
    "Ichinomiya",
    "Seki",
    "Gero",
    "Tarui",
    "Toki",
    "Minokamo",
  ],
  Shizuoka: [
    "Shizuoka",
    "Hamamatsu",
    "Numazu",
    "Fujinomiya",
    "Kakegawa",
    "Mishima",
    "Ito",
    "Fujieda",
    "Iwata",
    "Toyohashi",
  ],
  Aichi: [
    "Nagoya",
    "Toyota",
    "Okazaki",
    "Ichinomiya",
    "Nagakute",
    "Toyokawa",
    "Seto",
    "Aichi",
    "Kariya",
    "Tahara",
    "Anjo",
    "Gamou",
    "Nishio",
    "Inazawa",
    "Togo",
    "Shinshiro",
    "Tojo",
    "Aisai",
    "Mikawa",
    "Komaki",
  ],
  Mie: [
    "Tsu",
    "Ise",
    "Yokkaichi",
    "Kameyama",
    "Iga",
    "Kashihara",
    "Shima",
    "Owase",
    "Kuwana",
    "Taki",
  ],
  Shiga: [
    "Otsu",
    "Kusatsu",
    "Hikone",
    "Omihachiman",
    "Koka",
    "Tachikawa",
    "Minami-Kyoto",
    "Inuyama",
    "Yasu",
    "Nagahama",
  ],
  Kyoto: [
    "Kyoto",
    "Uji",
    "Kameoka",
    "Maizuru",
    "Fushimi",
    "Nagaokakyo",
    "Kizugawa",
    "Kyotanabe",
    "Seika",
    "Sakyo",
    "Fushimi",
    "Joyo",
    "Wazuka",
    "Kizugawa",
    "Nantan",
    "Kyotanabe",
    "Oyamazaki",
    "Mukaijima",
    "Ibaraki",
  ],
  Osaka: [
    "Osaka",
    "Sakai",
    "Takaishi",
    "Hirakata",
    "Toyonaka",
    "Takatsuki",
    "Ibaraki",
    "Suita",
    "Daito",
    "Suminoe",
    "Ikeda",
    "Amagasaki",
    "Settsu",
    "Kadoma",
    "Kishiwada",
    "Kawachinagano",
    "Osakasayama",
    "Minoh",
    "Sumoto",
    "Tondabayashi",
  ],
  Hyogo: [
    "Kobe",
    "Himeji",
    "Amagasaki",
    "Takarazuka",
    "Nishinomiya",
    "Kozu",
    "Sanda",
    "Toyooka",
    "Tatsuno",
    "Minamiawaji",
  ],
  Nara: [
    "Nara",
    "Yamatokoriyama",
    "Sakurai",
    "Tenri",
    "Kashihara",
    "Ikoma",
    "Koryo",
    "Heguri",
    "Gose",
    "Sango",
  ],
  Wakayama: [
    "Wakayama",
    "Shingu",
    "Kainan",
    "Tanabe",
    "Arida",
    "Gobo",
    "Kihoku",
    "Wakayama",
    "Kozagawa",
    "Yura",
  ],
  Tottori: [
    "Tottori",
    "Kurayoshi",
    "Yonago",
    "Sakaiminato",
    "Kurayoshi",
    "Tatsuno",
    "Hojyo",
    "Koyama",
    "Bunroku",
    "Kamo",
  ],
  Shimane: [
    "Matsue",
    "Izumo",
    "Unnan",
    "Hamada",
    "Oki",
    "Masuda",
    "Kara",
    "Mihonoseki",
    "Yatsuka",
    "Taki",
  ],
  Okayama: [
    "Okayama",
    "Kurashiki",
    "Tamano",
    "Sanyo",
    "Fukuda",
    "Kibichuo",
    "Mimasaka",
    "Osafune",
    "Seto",
    "Bizen",
  ],
  Hiroshima: [
    "Hiroshima",
    "Kure",
    "Fukuyama",
    "Onomichi",
    "Takehara",
    "Miyoshi",
    "Mihara",
    "Akiota",
    "Saeki",
    "Hatsukaichi",
  ],
  Yamaguchi: [
    "Yamaguchi",
    "Shimonoseki",
    "Ube",
    "Shuho",
    "Iwakuni",
    "Hofu",
    "Yoshiki",
    "Sanyo",
    "Tabuse",
    "Kudamatsu",
  ],
  Tokushima: [
    "Tokushima",
    "Anan",
    "Mugi",
    "Komatsu",
    "Tatsuno",
    "Takamatsu",
    "Zentsuji",
    "Awa",
    "Toba",
    "Nio",
  ],
  Kagawa: [
    "Takamatsu",
    "Marugame",
    "Tobe",
    "Sakaide",
    "Kanonji",
    "Mitoyo",
    "Sanuki",
    "Tamaoka",
    "Zentsuji",
    "Kotohira",
  ],
  Ehime: [
    "Matsuyama",
    "Imabari",
    "Niihama",
    "Uwajima",
    "Shikokuchuo",
    "Ozu",
    "Saijyo",
    "Tobe",
    "Yawatahama",
    "Matsuno",
  ],
  Kochi: [
    "Kochi",
    "Nankoku",
    "Ooka",
    "Niyodogawa",
    "Kochi",
    "Aki",
    "Sukumo",
    "Konan",
    "Mihara",
    "Tosa",
  ],
  Fukuoka: [
    "Fukuoka",
    "Kitakyushu",
    "Kurume",
    "Nagasaki",
    "Koga",
    "Onojo",
    "Chikuzen",
    "Dazaifu",
    "Yame",
    "Yanagawa",
  ],
  Saga: [
    "Saga",
    "Karatsu",
    "Imari",
    "Tosu",
    "Shiroishi",
    "Kawasaki",
    "Kudoyama",
    "Saga",
    "Ureshino",
    "Takeo",
  ],
  Nagasaki: [
    "Nagasaki",
    "Sasebo",
    "Isahaya",
    "Taku",
    "Unzen",
    "Shimabara",
    "Omura",
    "Nagayo",
    "Goto",
    "Yukawa",
  ],
  Kumamoto: [
    "Kumamoto",
    "Yatsushiro",
    "Amakusa",
    "Kikuchi",
    "Arao",
    "Hitoyoshi",
    "Uto",
    "Takamori",
    "Kosa",
    "Kamimashiki",
  ],
  Oita: [
    "Oita",
    "Beppu",
    "Nakatsu",
    "Usa",
    "Saiki",
    "Hita",
    "Kokonoe",
    "Taketa",
    "Kunisaki",
    "Bungotakada",
  ],
  Miyazaki: [
    "Miyazaki",
    "Nichinan",
    "Kobayashi",
    "Nobeoka",
    "Saito",
    "Kirishima",
    "Hyuga",
    "Mimata",
    "Ebino",
    "Takanabe",
  ],
  Kagoshima: [
    "Kagoshima",
    "Kanoya",
    "Izumi",
    "Satsumasendai",
    "Makurazaki",
    "Koshikijima",
    "Kirishima",
    "Amami",
    "Kagoshima",
    "Tarumizu",
  ],
  Okinawa: [
    "Naha",
    "Okinawa",
    "Nago",
    "Kadena",
    "Uruma",
    "Itoman",
    "Motobu",
    "Onna",
    "Nanjo",
    "Ginoza",
  ],
};

for (const region in cityOptions) {
  cityOptions[region] = [...new Set(cityOptions[region])];
}
