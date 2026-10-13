/* Dane quizu: treść pytania, 4 odpowiedzi, indeks poprawnej odpowiedzi i ciekawostka.
   Kolejność odpowiedzi jest losowana w app.js, więc tutaj poprawna może stać na dowolnym miejscu. */
window.QUESTIONS = [
  {
    q: 'Pod którym władcą Rzeczpospolita była największa w historii (ok. 1 mln km²)?',
    answers: ['Zygmunt III Waza', 'Kazimierz Wielki', 'Bolesław Chrobry', 'Jan III Sobieski'],
    correct: 0,
    fact: 'Szczyt przypadł na 1619 rok, po rozejmie w Dywilinie. Państwo było wtedy jednym z największych w Europie.'
  },
  {
    q: 'Który król miał najbardziej absurdalną śmierć? Według anegdoty przejadł się kiszonymi ogórkami.',
    answers: ['Michał Korybut Wiśniowiecki', 'August III Sas', 'Jan Kazimierz', 'Władysław IV'],
    correct: 0,
    fact: 'Historycy mówią raczej o chorobie żołądka, ale anegdota przetrwała do dziś.'
  },
  {
    q: 'Który król żył najdłużej, aż 88 lat, a zmarł od poparzenia przy kominku?',
    answers: ['Stanisław Leszczyński', 'Zygmunt Stary', 'Stanisław August', 'Jan III Sobieski'],
    correct: 0,
    fact: 'Od kominka zajął mu się szlafrok. Do tego dwa razy tracił tron.'
  },
  {
    q: 'Kto panował najdłużej jako król Polski (48 lat)?',
    answers: ['Władysław Jagiełło', 'Zygmunt III Waza', 'Kazimierz Wielki', 'Zygmunt Stary'],
    correct: 0,
    fact: 'Panował w latach 1386–1434, a za jego rządów odbyła się bitwa pod Grunwaldem.'
  },
  {
    q: 'Kto miał najkrótsze panowanie? Po kilku miesiącach uciekł nocą z Wawelu.',
    answers: ['Henryk Walezy', 'Jan Kazimierz', 'Stanisław Leszczyński', 'August III Sas'],
    correct: 0,
    fact: 'Zwiał, żeby zostać królem Francji. Szlachta goniła go aż do granicy.'
  },
  {
    q: 'Który król był najsilniejszy i podobno łamał podkowy gołymi rękami?',
    answers: ['August II Mocny', 'Jan III Sobieski', 'Bolesław Chrobry', 'Stefan Batory'],
    correct: 0,
    fact: 'Legenda przypisuje mu też kilkaset nieślubnych dzieci. Udokumentowanych jest kilka.'
  },
  {
    q: 'Który władca był podobno najniższy, stąd jego przydomek?',
    answers: ['Władysław Łokietek', 'Kazimierz Wielki', 'Leszek Czarny', 'Henryk Probus'],
    correct: 0,
    fact: 'Mały wzrostem, a zjednoczył kraj. Według legendy ukrywał się w Grocie Łokietka pod Ojcowem.'
  },
  {
    q: 'Który władca był największym budowniczym i wzniósł ok. 50 zamków?',
    answers: ['Kazimierz Wielki', 'Władysław Jagiełło', 'Zygmunt Stary', 'Bolesław Chrobry'],
    correct: 0,
    fact: 'To o nim mówi się: „zastał Polskę drewnianą, a zostawił murowaną”.'
  },
  {
    q: 'Kto poprowadził prawdopodobnie największą szarżę kawalerii w historii?',
    answers: ['Jan III Sobieski', 'Stefan Czarniecki', 'Władysław IV', 'Stefan Batory'],
    correct: 0,
    fact: 'Pod Wiedniem w 1683 roku ruszyło ok. 18 tysięcy jeźdźców, na czele z husarią.'
  },
  {
    q: 'Któremu królowi najwięcej synów zostało królami, aż czterech?',
    answers: ['Kazimierz Jagiellończyk', 'Władysław Jagiełło', 'Zygmunt Stary', 'Zygmunt III Waza'],
    correct: 0,
    fact: 'Nazywany „ojcem królów”. Jego synowie rządzili w Polsce, Czechach i na Węgrzech.'
  },
  {
    q: 'Kto miał największą różnicę wieku z żoną, około 50 lat?',
    answers: ['Władysław Jagiełło', 'Zygmunt Stary', 'Kazimierz Wielki', 'Zygmunt August'],
    correct: 0,
    fact: 'Ożenił się z 17-letnią Zofią Holszańską, gdy sam miał grubo ponad 60 lat. Doczekał się z nią dwóch synów.'
  },
  {
    q: 'Kto zgromadził największą kolekcję arrasów (ponad 300 sztuk)?',
    answers: ['Zygmunt August', 'Zygmunt Stary', 'Stefan Batory', 'Władysław IV'],
    correct: 0,
    fact: 'Część z nich do dziś wisi na Wawelu.'
  },
  {
    q: 'Kto był najmłodszym królem w chwili śmierci? Zginął w bitwie w wieku 20 lat.',
    answers: ['Władysław Warneńczyk', 'Jan Olbracht', 'Aleksander Jagiellończyk', 'Ludwik Węgierski'],
    correct: 0,
    fact: 'Ciała nie odnaleziono. Legenda mówi, że przeżył i żył incognito na Maderze.'
  },
  {
    q: 'Który król najbardziej olewał Polskę? Przez 30 lat panowania spędził w niej łącznie ok. 2 lata.',
    answers: ['August III Sas', 'August II Mocny', 'Stefan Batory', 'Zygmunt III Waza'],
    correct: 0,
    fact: 'Wolał polowania i operę w Dreźnie. Stąd powiedzenie „za króla Sasa jedz, pij i popuszczaj pasa”.'
  },
  {
    q: 'Który król zostawił po sobie największe długi, które po rozbiorach spłacali za niego zaborcy?',
    answers: ['Stanisław August Poniatowski', 'August III Sas', 'Jan Kazimierz', 'Stanisław Leszczyński'],
    correct: 0,
    fact: 'Był wielkim mecenasem sztuki, ale na kredyt.'
  },
  {
    q: 'Która władczyni zrobiła największy prezent dla nauki, oddając swoje klejnoty na odnowienie Akademii Krakowskiej?',
    answers: ['Jadwiga Andegaweńska', 'Bona Sforza', 'Anna Jagiellonka', 'Elżbieta Łokietkówna'],
    correct: 0,
    fact: 'Dziś to Uniwersytet Jagielloński.'
  }
];
