var ChangeLogApp = angular.module("ChangeLogApp", []);

ChangeLogApp.controller('ChangeLogController', function ($http, $scope) {

    let w_i = null
    let chosen_w = null
    $scope.current_guess = []
    $scope.guess_matrix = []
    $scope.vocab = []
    $scope.dict = []
    $scope.expected_result = ""

    $scope.active = false

    let reapply = function() {
        $scope.$apply()
        // ignore - todo - can this be cleaned up?
    }

    let restart = function (seeded) {

        if (seeded) {
            w_i = Math.floor($scope.vocab.length * mulberry32(day_of_year())())
        } else
            w_i = Math.floor($scope.vocab.length * Math.random())
        chosen_w = $scope.vocab[w_i]
        $scope.expected_result = chosen_w
        $scope.current_guess = []
        $scope.guess_matrix = []

        $scope.active = true
        $scope.bad_letters = []
        $scope.mid_letters = []
        $scope.good_letters = []
        reapply()
    }

    let startDialogue = function () {
        Swal.fire({
            title: "Avviż!",
            showCancelButton: false,
            html: "<h1>Il-kliem qabel kienu bilfors nomi. M'għadiex hekk il-logħba issa. Jistaw ikunu kwalunkwe kelma ta' ħames ittri. <br> - Michael Pulis",
            confirmButtonText: "Tajjeb",
            allowOutsideClick: false,
        }).then((r) => {
            Swal.fire({
                title: "Wordle bil-Malti",
                showCancelButton: false,
                html: "Għandek 6 tentattivi biex taqta' l-kelma ta' ħames ittri..<br> > Jekk taqta' ittra fil-post it-tajjeb, tiġi ħadra.<br> > Jekk taqta' ittra imma mhux f'postha, tiġi oranġjo.<br> > Jekk l-ebda, tibqa' griża.<br> Kliem meħud minn <a href='https://mlrs.research.um.edu.mt/resources/gabra/' target='_blank'> Ġabra </a> <br> - Michael Pulis",
                confirmButtonText: "Tajjeb",
                allowOutsideClick: false,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                Swal.fire({
                    title: "Trid tilgħab il-kelma tal-lum, jew kelma li tkun?",
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: "Tal-lum",
                    denyButtonText: `Li Tkun`,
                    allowOutsideClick: false,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        restart(true)
                    } else if (result.isDenied) {
                        restart(false)
                    }
                })
            })

        })


    }

    Promise.all([
        fetch('answers.json').then(resp => resp.json()).then(json => $scope.vocab = json),
        fetch('dictionary.json').then(resp => resp.json()).then(json => $scope.dict = json)
    ]).then(startDialogue)

    $scope.top_row = ['Q', 'W', 'E', 'R', 'T', 'U', 'I', '?', 'O', 'P']
    $scope.mid_row = ['A', 'S', 'D', 'F', 'G', 'Ħ', 'H', '/', 'J', 'K', 'L']
    $scope.bot_row = ['⏎', 'Z', 'Ż', 'X', 'Ċ', 'V', 'Ġ', 'B', 'N', 'M', '⌫']
    $scope.bad_letters = []
    $scope.mid_letters = []
    $scope.good_letters = []

    $scope.getClassForRow = function (row) {
        let guess = $scope.guess_matrix[row]

        let res = []

        let letters = {}
        for (let i = 0; i < chosen_w.length; i++) {
            res.push("")

            let c = chosen_w[i]

            if (!(c in letters)) letters[c] = 1
            else letters[c] += 1
        }

        // remove the greens
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] == chosen_w[i]) {
                res[i] = "green"
                letters[guess[i]] -= 1
                $scope.good_letters.push(guess[i])

            }
        }

        // do the oranges
        for (let i = 0; i < guess.length; i++) {
            gl = guess[i]
            if (gl in letters && letters[gl] > 0) {

                if (res[i] != 'green') {
                    letters[gl] -= 1
                    res[i] = "orange"
                    $scope.mid_letters.push(gl)
                }
            }
        }

        // add the bad ones to the keyboard
        for (let i = 0; i < guess.length; i++) {
            let gl = guess[i]
            if (!chosen_w.includes(gl)) $scope.bad_letters.push(gl)
        }
        return res
    }

    let get_emoji_string = function (guessed_it) {
        let emoji_string = ''
        let score = 0

        for (let i = 0; i < $scope.guess_matrix.length; i++) {
            score += 1
            split_word = $scope.getClassForRow(i).toString().split(',')

            for (color in split_word) {
                if (split_word[color] == 'orange') {
                    emoji_string += '🟧'
                } else if (split_word[color] == 'green') {
                    emoji_string += '🟩'
                } else {
                    emoji_string += '⬛'
                }
            }
            emoji_string += '\n'
        }

        score = guessed_it ? score : "X"
        return ' Werdil ' + score + '/6\n' + emoji_string
    }

    $scope.handleSpecials = function (code, st) {
        if (code == 8) {
            $scope.current_guess.pop()
        } else if (code == 13) {
            if ($scope.current_guess.length != 5) return

            inputted_word = $scope.current_guess.join("")
            word_exists = inputted_word == $scope.expected_result || $scope.dict.indexOf(inputted_word) > -1

            if (word_exists) {
                $scope.guess_matrix.push([...$scope.current_guess])
                if ($scope.current_guess.join("") == chosen_w) {
                    $scope.active = false
                    $scope.getWordDefinition(chosen_w, true)
                } else if ($scope.guess_matrix.length == 6) {
                    $scope.active = false
                    $scope.getWordDefinition(chosen_w, false)
                }
                $scope.current_guess = []
            }else{
                $scope.current_guess = []
                Swal.fire({
                    title: 'Mhux fid-dizzjunarju!',
                    icon: 'error',
                    confirmButtonText: 'Ma ġara xejn'
                }).then((result) => {
                })
            }
            
        }
        reapply()
    }

    let word_to_real = function (word) {
        return word.replace("?", "ie").replace("/", "għ")
    }

    let day_of_year = function () {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day
    }

    let mulberry32 = function (a) {
        return function () {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    let showSnackbarMessage = function (message) {
        var x = document.getElementById("snackbar");
        x.className = "show";
        x.textContent = message;
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 6000);
    }

    $scope.getWordDefinition = function (word, managed) {
        $http({
            method: 'GET',
            url: 'https://mlrs.research.um.edu.mt/resources/gabra-api/lexemes/search?s=' + word_to_real(word)
        }).then(function successCallback(response) {
            resp = response.data.results[0].lexeme.glosses[0].gloss.trim()
            Swal.fire({
                title: managed ? 'Proset!' : "Ma qtajtx! '" + word_to_real(word) + "' kienet.",
                text: word_to_real(word) + ' bl-Ingliż tiġi \'' + resp + '\'',
                icon: 'info',
                denyButtonText: 'Aqsam ir-riżultat',
                showDenyButton: true,
                allowOutsideClick: false,
                confirmButtonText: 'Ipprova kelma oħra'
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    restart(false)
                } else {
                    get_emoji_string()
                    navigator.clipboard.writeText(get_emoji_string(managed))
                    showSnackbarMessage('Ir-riżultat ġie kkupjat fil-clipboard.')
                }
            })

        }, function errorCallback(response) {
            return "ERRORSWAG"
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    $scope.handleRegular = function (st) {
        if (!$scope.active) return
        let last_letter = $scope.current_guess[$scope.current_guess.length - 1]
        if (st == 'e' && $scope.current_guess.length > 0 && last_letter == 'i') {
            $scope.current_guess.pop()
            $scope.current_guess.push("?")
            return
        } else if (st == 'ħ' && $scope.current_guess.length > 0 && last_letter == 'g') {
            $scope.current_guess.pop()
            $scope.current_guess.push("/")
            return
        }

        if (st.match(/[0-9A-Za-zħġżċ?/!]/) && $scope.current_guess.length < 5)
            $scope.current_guess.push(st)
    }

    document.addEventListener("keypress", function (event) {
        if (!$scope.active) return

        let code = event.keyCode
        let st = String.fromCharCode(code)

        if (code == 8) {
            $scope.current_guess.pop()
        } else {
            $scope.handleRegular(st)
        }
        reapply()
    });

    document.addEventListener("keyup", function (event) {
        if (!$scope.active) return

        let code = event.keyCode
        let st = String.fromCharCode(code)

        $scope.handleSpecials(code, st)
    });

    $scope.pushLetter = function (lt) {
        if (lt == '⌫') {
            $scope.handleSpecials(8, "")
            return
        } else if (lt == '⏎') {
            $scope.handleSpecials(13, "")
            return
        }
        $scope.handleRegular(lt)
    }

    $scope.renderLetter = function (lt) {
        // console.log(lt)
        if (lt == '/') return 'GĦ'
        else if (lt == '?') return 'IE'
        else return lt.toUpperCase()
    }

    $scope.keyb_colour = function (lr) {
        if ($scope.bad_letters.includes(lr)) return "bad"
        if ($scope.good_letters.includes(lr)) return "good"
        if ($scope.mid_letters.includes(lr)) return "mid"
        else return ""
    }

    $scope.remainder = function(){
        let a = []
        for (let i = 0; i < 6-$scope.guess_matrix.length-1; i ++) a.push(i)

        // console.log('returning',a)
        return a
    }
});