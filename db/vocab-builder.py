# coding=utf8

# By Michael Pulis / Franco Cassar Manghi
import json, jsonlines
relevant_pos = set()

def maltese_to_placeholders(word):
    result = word.replace("għ", "/")
    result = result.replace("ie", "?")
    return result

def is_wordform_valid(wordform):
    return not('generated' in wordform) and  'lexeme_id' in wordform and '$oid' in wordform['lexeme_id'] and 'surface_form' in wordform

def is_wordform_lexeme_supported(wordform):
    return is_wordform_valid(wordform) and wordform['lexeme_id']["$oid"] in relevant_pos

# get part of speech of each word
with jsonlines.open("lexemes.json") as reader:
    for lexeme in reader:
        if('norm_freq' in lexeme and float(lexeme['norm_freq']['$numberDouble']) > 2):
            relevant_pos.add(lexeme["_id"]["$oid"])

answers = set()

print("Loaded %s relevant lexemes" % len(relevant_pos))
flw = set()
# get all the words that are nouns and 5 chars long - discard everything else
with jsonlines.open("wordforms.json") as reader:
    for wordform in reader:
        
        if 'surface_form' in wordform and len(maltese_to_placeholders(wordform['surface_form']).lower()) == 5:
            flw.add(maltese_to_placeholders(wordform['surface_form']).lower())

        if not is_wordform_lexeme_supported(wordform):
            continue

        word = wordform['surface_form'].lower()
        word = maltese_to_placeholders(word)
        if len(word) == 5:
            answers.add(word)

print("Saving the answers...")
with open ("answers.json", "w",  encoding='utf8') as file:
    json.dump(list(answers), file, ensure_ascii=False, indent=2) # pretty print to make it easy to diff when updating dictionary

print("Saving all possible 5 letter words...")
with open ("dictionary.json", "w",  encoding='utf8') as file:
    json.dump(list(flw), file, ensure_ascii=False, indent=2) 

print("Filtered %s relevant words matching 5 char length and of relevant POS." % len(answers))

print("FLW: ", len(flw))
