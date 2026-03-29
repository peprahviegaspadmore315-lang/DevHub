from pathlib import Path

def parse_values(line):
    s=line.strip().rstrip(',;')
    if not s.startswith('(') or not s.endswith(')'):
        return None
    s=s[1:-1]  # inside parens
    vals=[]
    cur=''
    quote=False
    depth=0
    for ch in s:
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
    if cur.strip() != '':
        vals.append(cur.strip())
    return vals


def fix_file(src_path, dst_path):
    lines = Path(src_path).read_text(encoding='utf-8').splitlines()
    out_lines=[]
    inside_values=False
    for line in lines:
        stripped=line.strip()
        if stripped.upper().startswith('INSERT INTO TOPICS'):
            inside_values=True
            out_lines.append(line)
            continue
        if inside_values and stripped.upper().startswith('VALUES'):
            out_lines.append(line)
            continue
        if inside_values and stripped.startswith('('):
            vals = parse_values(line)
            if vals is None:
                out_lines.append(line)
                continue
            if len(vals) == 11:
                vals.insert(7, "''")
            elif len(vals) != 12:
                print('unexpected len', len(vals), 'line', line)
            trailing = ''
            if line.strip().endswith(','):
                trailing = ','
            elif line.strip().endswith(';'):
                trailing = ';'
            out_lines.append('(' + ','.join(vals) + ')' + trailing)
            continue
        if inside_values and stripped == '':
            out_lines.append(line)
            continue
        out_lines.append(line)
    Path(dst_path).write_text('\n'.join(out_lines)+'\n', encoding='utf-8')

if __name__=='__main__':
    fix_file('database/seed_python_topics_structured.sql','database/seed_python_topics_structured_fixed.sql')
    fix_file('database/seed_css_topics_structured.sql','database/seed_css_topics_structured_fixed.sql')
    print('fixed files generated')
