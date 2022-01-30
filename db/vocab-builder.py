# coding=utf8

# By Michael Pulis / Franco Cassar Manghi
import json, jsonlines
relevant_pos = set()

def maltese_to_placeholders(word):
    result = word.replace("għ", "/")
    result = word.replace("ie", "?")
    return result

def is_wordform_valid(wordform):
    return 'lexeme_id' in wordform and '$oid' in wordform['lexeme_id'] and 'surface_form' in wordform

def is_wordform_lexeme_supported(wordform):
    return is_wordform_valid(wordform) and wordform['lexeme_id']["$oid"] in relevant_pos

# get part of speech of each word
with jsonlines.open("lexemes.json") as reader:
    for lexeme in reader:
        if "pos" not in lexeme:
            continue
        lexeme_pos = lexeme["pos"]
        if lexeme_pos == "NOUN": # do not load more items than we need into memory we only need NOUNs
            relevant_pos.add(lexeme["_id"]["$oid"])

dictionary = set()

print("Loaded %s relevant lexemes" % len(relevant_pos))

# get all the words that are nouns and 5 chars long - discard everything else
with jsonlines.open("wordforms.json") as reader:
    for wordform in reader:
        if not is_wordform_lexeme_supported(wordform):
            continue
        word = wordform['surface_form'].lower()
        word = maltese_to_placeholders(word)
        if len(word) == 5:
            dictionary.add(word)

print("Sorting dictionary")
dictionary = sorted(dictionary)

print("Writing dictionary")
with open ("dictionary.json", "w",  encoding='utf8') as file:
    json.dump(dictionary, file, ensure_ascii=False, indent=2) # pretty print to make it easy to diff when updating dictionary

print("Filtered %s relevant words matching 5 char length and of relevant POS." % len(dictionary))
