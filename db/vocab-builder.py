# coding=utf8

# By Michael Pulis / Franco Cassar Manghi
import json, jsonlines

word_len = 5
norm_frequency_threshold = 2

relevant_pos = set()

def maltese_to_placeholders(word):
    result = word.replace("għ", "/")
    result = result.replace("ie", "?")
    return result

def is_wordform_auto_generated(wordform):
    return 'generated' in wordform and wordform['generated'] == True

def has_word(wordform):
    return 'surface_form' in wordform

def is_wordform_valid(wordform):
    return not is_wordform_auto_generated(wordform) and \
        'lexeme_id' in wordform and \
        '$oid' in wordform['lexeme_id'] and \
        has_word(wordform)

def is_wordform_lexeme_supported(wordform):
    return is_wordform_valid(wordform) and wordform['lexeme_id']["$oid"] in relevant_pos

# get part of speech of each word
with jsonlines.open("lexemes.json") as reader:
    for lexeme in reader:
        if('norm_freq' in lexeme and float(lexeme['norm_freq']['$numberDouble']) > norm_frequency_threshold):
            relevant_pos.add(lexeme["_id"]["$oid"])

print("Loaded %s relevant lexemes" % len(relevant_pos))

answers = set()
dictionary = set()
# get all the words that are nouns and 5 chars long - discard everything else
with jsonlines.open("wordforms.json") as reader:
    for wordform in reader:
        if not has_word(wordform):
            continue
        word = wordform['surface_form'].lower()
        word = maltese_to_placeholders(word)
        actual_length = len(word)
        if actual_length != word_len:
            continue
        dictionary.add(word)

        if not is_wordform_lexeme_supported(wordform):
            continue
        answers.add(word)

print("Sorting answers")
answers = sorted(answers) # sort so as to make it easy to diff when updating committed answers file

print("Sorting dictionary")
dictionary = sorted(dictionary) # sort so as to make it easy to diff when updating committed dictionary file

print("Saving the answers...")
with open ("answers.json", "w",  encoding='utf8') as file:
    json.dump(list(answers), file, ensure_ascii=False, indent=2) # pretty print to make it easy to diff when updating dictionary

print("Saving all possible 5 letter words (the full dictionary)...")
with open ("dictionary.json", "w",  encoding='utf8') as file:
    json.dump(list(dictionary), file, ensure_ascii=False, indent=2) 

print("Done")
print("Filtered %s relevant words matching 5 char length to be used as acceptable answers." % len(answers))
print("Filtered %s relevant words matching 5 char length to be used as acceptable inputs." % len(dictionary))
