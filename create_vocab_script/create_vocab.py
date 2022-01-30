# coding=utf8

# By Michael Pulis
import json
pos = {}

# get part of speech of each word
with open(r"lexems.json", "r", encoding="utf-8") as file:
    lines = file.read().split("\n")
    for line in lines:
        try:
            content = json.loads(line, encoding="utf8")
            pos[content["_id"]["$oid"]] = content["pos"]
        except Exception as e: pass

low = []

# get all the words that are nouns
with open(r"test.json", "r", encoding="utf-8") as file:
    lines = file.read().split("\n")
    for line in lines:
        try:
            content = json.loads(line, encoding="utf8")
            if(pos[content['lexeme_id']["$oid"]] == "NOUN"):
                low.append(content['surface_form'])
        except Exception as e: pass

print("nouns: " , len(low))

flw = []
for word in low:
    w2 = word.strip().lower()
    if(not w2.isalpha()): continue

    w2 = w2.replace("għ", "/")
    w2 = w2.replace("ie", "?")
    if(len(w2) == 5 and w2 not in flw): flw.append(w2)


with open ("outut.txt", "w",  encoding='utf8') as file:
    json.dump(flw, file, ensure_ascii=False)
print(len(flw))
