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

Tista' tħaddem il-logħoba lokalment billi tuża Docker u Docker Compose u tagħmel:

```bash
docker-compose up -d 
```

u żur [http://localhost:8080](http://localhost:8080).

***

Biex tiġġenera dizzjunarju ġdid:

> Għandu jkollok `docker` installat biex tuża dan.

1. Iċċekkja li l-URL ġewwa [db/entrypoint.sh](db/entrypoint.sh) huwa ssettjat għal verżjoni li tixtieq tuża.
2. Fuq sistema li tisapportja Bash (Mac / Linux), eżegwixxi: `./refresh-dictionary.sh`.
    * Jekk qed tuża l-Windows biex tiġġenera dan il-file, sempliċiment eżegwixxi l-kmand ta' `docker` li ssib ġewwa [./refresh-dictionary.sh](./refresh-dictionary.sh).

Dan il-proċess idum ftit minuti, u jirriżulta f'file ġdid jiġi ġġenerat: [site/dictionary.json](site/dictionary.json).