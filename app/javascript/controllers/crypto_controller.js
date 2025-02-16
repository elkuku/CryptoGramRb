import {Controller} from "@hotwired/stimulus"

// Connects to data-controller="crypto"
export default class extends Controller {
    static targets = ['letter', 'key', 'error', 'success']

    static values = {
        phrase: String,
        noLetters: Array,
        errors: Number,
    }

    letters = []
    unique_letters = []
    selectedLetter = -1
    solvedLetters = []

    connect() {
        this.letters = [...this.phraseValue.toUpperCase()]

        this.unique_letters = this.letters
            .filter((value, index, array) => array.indexOf(value) === index)
            .filter((value) => false === this.noLettersValue.includes(value))
            .sort(() => .5 - Math.random())

        const hints = []
        const maxHints = 5

        do {
            let hint = this.unique_letters[Math.floor(Math.random() * this.unique_letters.length)];
            if (false === hints.includes(hint)) {
                hints.push(hint)
            }
        } while (hints.length < maxHints);

        for (const [index, letter] of this.letters.entries()) {
            if (this._isLetter(letter)) {
                this._setLetter(index, '&nbsp;&nbsp;&nbsp;', this._getCode(letter))
            } else {
                this._setLetter(index, null, letter)
            }
        }

        for (let target of this.keyTargets) {
            if (this.unique_letters.includes(target.textContent.trim())) {
                this._setButtonClass(target, 'btn-info');
            } else {
                this._setButtonClass(target, 'btn-outline-secondary');
                target.setAttribute('disabled', 'disabled')
            }
        }

        for (let hint of hints) {
            for (let [index, letter] of this.letters.entries()) {
                if (letter === hint) {
                    this.solvedLetters.push(index)
                    this._setLetter(index, letter, this._getCode(letter))
                    this._checkCompleted(hint)
                    break
                }
            }

        }

        this._selectNextLetter()
    }

    selectLetter(event) {
        if (this.solvedLetters.includes(event.params.index)) {
            return
        }

        if (false === this._isLetter(this.letters[event.params.index])) {
            return
        }

        this._selectLetter(event.params.index)
    }

    guessLetter(event) {
        if (null === this.selectedLetter) {
            console.error('Please select a letter')

            return;
        }

        this._guessLetter(event.params.letter)
    }

    handleKeyDown(event) {
        if ('ArrowRight' === event.key) {
            this._selectNextLetter()
        } else if ('ArrowLeft' === event.key) {
            this._selectPreviousLetter()
        } else {
            const key = event.key.toUpperCase()
            if (this.unique_letters.includes(key)) {
                this._guessLetter(key)
            }
        }
    }

    errorsValueChanged(e) {
        this.errorTarget.innerHTML = '❌'.repeat(e)
    }

    _guessLetter(letter) {
        const selected_letter = this.letters[this.selectedLetter]

        if (this.solvedLetters.includes(this.selectedLetter)) {
            return
        }

        if (letter === selected_letter) {
            this.solvedLetters.push(this.selectedLetter);
            this._setLetter(this.selectedLetter, letter, this._getCode(letter))
            if (false === this._checkCompleted(letter)) {
                this._selectNextLetter()
            }
        } else {
            this._setLetter(this.selectedLetter, 'Not a ' + letter, this._getCode(letter))
            this.errorsValue++
            // TODO: nicer error
        }
    }

    _setLetter(targetIndex, letter, code) {

        this.letterTargets[targetIndex].innerHTML = (letter ? '<div class="letterContainer">' + letter + '</div>' : '') + code
    }

    _checkCompleted(letter) {
        for (let [index, value] of this.letters.entries()) {
            if (value === letter) {
                if (false === this.solvedLetters.includes(index)) {
                    for (let target of this.keyTargets) {
                        if (target.textContent.trim() === letter) {
                            this._setButtonClass(target, 'btn-success')
                        }
                    }

                    // Letters missing...
                    return false
                }
            }
        }

        // All letters found

        for (let target of this.keyTargets) {
            if (target.textContent.trim() === letter) {
                this._setButtonClass(target, 'btn-secondary')
            }
        }

        for (let [index, value] of this.letters.entries()) {
            // Remove the "code" numbers from all fields of the "letter"
            if (value === letter) {
                this.letterTargets[index].innerText = letter
                this.letterTargets[index].classList.remove('letter')
            }
        }

        for (let [index, value] of this.letters.entries()) {
            if (this._isLetter(value) && false === this.solvedLetters.includes(index)) {

                // Letters missing...
                return false
            }
        }

        // Everything is solved!
        console.log('JUHUUU')
        this._unselectLetters()
        this.successTarget.style.display = 'block'

        this.successTarget.innerText = 'JUHUUUUU =;)'// this.hooraysValue[Math.floor(Math.random() * 5)]

        // TODO: more JUHUUUUU =;)

        return true
    }

    _selectNextLetter() {

        let found = false
        let check = this.selectedLetter + 1

        if (check === this.letters.length) {
            check = 0
        }

        do {
            if (this.solvedLetters.includes(check)
                || this._isLetter(this.letters[check]) === false) {
                check++
                if (check === this.letters.length) {
                    check = 0
                }
            } else {
                this._selectLetter(check)
                found = true
            }
        } while (!found)
    }

    _selectPreviousLetter() {

        let found = false
        let check = this.selectedLetter - 1

        if (check === -1) {
            check = this.letters.length - 1
        }

        do {
            if (this.solvedLetters.includes(check)
                || this._isLetter(this.letters[check]) === false) {
                check--
                if (check < 0) {
                    check = this.letters.length - 1
                }
            } else {
                this._selectLetter(check)
                found = true
            }
        } while (!found)
    }

    _selectLetter(index) {
        this._unselectLetters()

        this.letterTargets[index].classList.add('letter-selected')

        this.selectedLetter = index
        //  console.log(this.selectedLetter)
    }

    _unselectLetters() {
        for (let target of this.letterTargets) {
            target.classList.remove('letter-selected')
        }
    }

    _setButtonClass(element, className) {
        element.classList.remove('btn-success')
        element.classList.remove('btn-secondary')
        element.classList.remove('btn-info')
        element.classList.add(className)
    }

    _isLetter(letter) {
        return !this.noLettersValue.includes(letter)
    }

    _getCode(letter) {
        return this.unique_letters.indexOf(letter) + 1
    }
}
