from pathlib import Path

def parse_values(line):
    s=line.strip().rstrip(',')
    if not s.startswith('(') or not s.endswith(')'):
        return None
    inner=s[1:-1]
    vals=[]
    quote=False
    depth=0
    cur=''
    for ch in inner:
        if ch=="'":
            quote=not quote
            cur+=ch
        elif quote:
            cur+=ch
        else:
            if ch=='(':
                depth+=1
                cur+=ch
            elif ch==')':
                depth-=1
                cur+=ch
            elif ch==',' and depth==0:
                vals.append(cur.strip())
                cur=''
            else:
                cur+=ch
    if cur.strip():
        vals.append(cur.strip())
    return vals

for fname in ['database/seed_python_topics_structured_fixed.sql','database/seed_css_topics_structured_fixed.sql']:
    lines = Path(fname).read_text('utf-8').splitlines()
    print('---', fname)
    for i,line in enumerate(lines,1):
        if line.strip().startswith('('):
            vals=parse_values(line)
            if vals is None: continue
            if len(vals) != 12:
                print('line', i, 'count', len(vals), line)
