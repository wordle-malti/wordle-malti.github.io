# Werdil (Wordle, imma bil-Malti)

Tista' taċċessa l-logħba hawn: https://wordle-malti.github.io/

Magħmulha minn Michael Pulis (https://github.com/michaelpulis)

Kontribuzzjonijiet Oħrajn:
+ Liam Attard (https://github.com/liamattard): 'Share' Feature
+ Sean Diacono (https://github.com/seandiacono): Updated CSS
+ David Schembri (https://ikteb.mt): Qari tal-provi
+ Franco Cassar Manghi (https://github.com/francocm): Refactoring / Bug Fixes

***
Idea meħuda direttament minn https://www.powerlanguage.co.uk/wordle/
***

TODO List: https://github.com/wordle-malti/wordle-malti.github.io/wiki

***

Tista' tħaddem il-logħoba lokalment billi tuża `docker` u `docker-compose` u tagħmel:

```bash
docker-compose up -d 
```

u żur [http://localhost:8080](http://localhost:8080).

***

Biex tiġġenera dizzjunarju ġdid:

> Għandu jkollok `docker` installat biex tuża dan.

1. Iċċekkja li l-URL ġewwa [db/entrypoint.sh](db/entrypoint.sh) huwa ssettjat għall-verżjoni li tixtieq tuża.
2. Fuq sistema li tisapportja Bash (Mac / Linux), eżegwixxi: `./refresh-dictionary.sh`.
    * Jekk qed tuża l-Windows biex tiġġenera dan il-file:
        * Agħmel użu ta' Windows Subsystem for Linux (WSL) u kun ċert li dan il-proġett ġie cloned direttament ġewwa direttorju tal-Linux u mhux Windows (voldieri **mhux** ġo `/mnt/c` iżda x'imkien ieħor). Jaf ukoll jagħti l-każ li jkollok tagħti l-_permission_ `x` _(execute)_ billi tagħmel `chmod +x refresh-dictionary.sh && chmod +x db/entrypoint.sh`, dan minħabba li l-Windows jaf jitlef din l-informazzjoni waqt il-proċess ta' `git clone`.
        * Ara li għandek `bash` disponibbli fl-_environment_ tiegħek.
        * Sempliċiment eżegwixxi l-kmand ta' `docker` li ssib ġewwa [./refresh-dictionary.sh](./refresh-dictionary.sh).

Dan il-proċess idum ftit minuti (3-5 minuti), u jirriżulta f'file ġdid jiġi ġġenerat: [docs/dictionary.json](docs/dictionary.json). Minkejja li l-files li qed jiġu pproċessati huma akbar minn 1GB+, dan il-proċess juża biss madwar 35MB RAM, għax il-files qed jiġu streamed. Biex dan ikun effiċjenti, qed jintuża l-prinċipju ta' `jsonlines`. Finalment id-dizzjunarju prodott bħala riżultat, hu kbir biss ~30KB.

***

Il-Javascript file [docs/app.js](docs/app.js) qed jiġi mpurtat ġewwa [docs/index.html](docs/index.html) billi jinkludi ukoll `integrity hash`. Ir-raġuni primarja għalfejn din qegħda hemm hi biex iġġiegħel il-browser jerġa' jniżżel dan il-fajl u mhux juża l-_cache_ jekk il-verżjoni tinbidel (għax jekk tinbidel ikun hemm hash ġdid). Hemm ukoll vantaġġi oħra relatati ma' security.

Biex tiġġenera hash ġdid jekk [docs/app.js](docs/app.js) ikun inbidel, fuq sistema fejn għandek `bash` u `openssl`, agħmel:

```bash
openssl dgst -sha512 -binary app.js | openssl base64 -A
```

Ir-riżultat imbagħad poġġieh parti mill-`<script charset="UTF-8" src="app.js" integrity="sha512-[RIŻULTAT_HAWNEKK]"  crossorigin="anonymous" ></script>` _(innota l-prefiss `sha512-`)_.

***

## GitHub Pages

Is-sit tiġi ppubblikata awtomatikament fuq GitHub Pages. Minħabba limitazzjonijiet prattiċi ta' GitHub, bħalissa dan qed issettjat li jaqra l-files taħt [docs/](docs/).