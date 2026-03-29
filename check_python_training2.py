from pathlib import Path
text = Path('database/seed_python_topics_structured_fixed.sql').read_text('utf-8')
for i,line in enumerate(text.splitlines(),1):
    if "python-training" in line:
        print('line', i, line)
        s=line.strip().rstrip(',;')
        if s.startswith('(') and s.endswith(')'):
            inner=s[1:-1]
            vals=[]
            quote=False
            depth=0
            cur=''
            for ch in inner:
                if ch == "'":
                    quote = not quote
                    cur += ch
                elif quote:
                    cur += ch
                else:
                    if ch == '(':
                        depth += 1
                        cur += ch
                    elif ch == ')':
                        depth -= 1
                        cur += ch
                    elif ch == ',' and depth == 0:
                        vals.append(cur.strip())
                        cur=''
                    else:
                        cur += ch
            if cur.strip():
                vals.append(cur.strip())
            print('values', len(vals))
            for index,v in enumerate(vals,1):
                print(index, v)
