module PhraseHelper
  class LanguageHelper
    def initialize
      @not_letters = [ " ", ",", ".", "'", "‘", "’", ";", "-" ]
      @special_chars = {
        "de" => [ "Ä", "Ö", "Ü", "ß" ],
        "en" => [],
        "es" => [ "Á", "É", "Í", "Ó", "Ú", "Ñ", "Ü" ]
      }

      @common_letters = *("A".."Z")
    end

    def all_letters(lang)
      @common_letters + @special_chars[lang]
    end

    def no_letters
      @not_letters
    end
  end

  def random_phrase(lang)
    "Halli Galli, aber Dalli"
  end

  def all_letters(lang)
    LanguageHelper.new.all_letters(lang)
  end

  def no_letters
    LanguageHelper.new.no_letters
  end

  def random_crypto(lang = "en")
    not_letters = [ " ", ",", ".", "'", "‘", "’", ";", "-" ]
    special_chars = {
      "de" => [ "Ä", "Ö", "Ü", "ß" ],
      "en" => [],
      "es" => [ "Á", "É", "Í", "Ó", "Ú", "Ñ", "Ü" ]
    }
    phrase = "Halli Galli, aber Dalli"
    chars = phrase.upcase.chars
    unique = chars.uniq

    common_letters = *("A".."Z")
    all_letters = common_letters + special_chars[lang]
    letters = []

    all_letters.each do |l|
      letters.push([ l, !not_letters.include?(l) ])
    end

    [ phrase, letters, chars, unique ]
  end
end
