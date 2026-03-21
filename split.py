import os
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

s1 = text.find('<style>')
s2 = text.rfind('</style>') + 8
j1 = text.find('<script>')
j2 = text.rfind('</script>') + 9

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(text[s1+7:s2-8].strip())

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text[j1+8:j2-9].strip())

new_text = text[:s1] + '<link rel="stylesheet" href="style.css">\n' + text[s2:j1] + '<script src="app.js"></script>\n' + text[j2:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('SPLIT_DONE')
