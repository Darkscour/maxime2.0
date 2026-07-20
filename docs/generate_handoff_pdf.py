"""Generate MAXIME_CHAT_HANDOFF.pdf from markdown source."""
from pathlib import Path
from fpdf import FPDF

DOCS = Path(__file__).parent
MD = DOCS / "MAXIME_CHAT_HANDOFF.md"
PDF = DOCS / "MAXIME_CHAT_HANDOFF.pdf"


class HandoffPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, "Maxime Project - Chat Handoff", align="R", new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")

    def write_block(self, text: str, size: int = 10, style: str = "", color=(50, 50, 50)):
        self.set_font("Helvetica", style, size)
        self.set_text_color(*color)
        w = self.w - self.l_margin - self.r_margin
        safe = sanitize(text)
        if not safe.strip():
            return
        self.multi_cell(w, size * 0.45, safe)


def sanitize(text: str) -> str:
    replacements = {
        "\u2014": "-",
        "\u2013": "-",
        "\u2192": "->",
        "\u2194": "<->",
        "\u201c": '"',
        "\u201d": '"',
        "\u2018": "'",
        "\u2019": "'",
        "\u2026": "...",
        "\u2713": "yes",
        "\u2717": "no",
        "`": "",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text.encode("latin-1", errors="replace").decode("latin-1")


def is_table_sep(line: str) -> bool:
    stripped = line.replace("|", "").replace("-", "").replace(":", "").strip()
    return not stripped


def table_to_text(line: str) -> str:
    cells = [c.strip() for c in line.strip("|").split("|")]
    return "  |  ".join(c for c in cells if c)


def main():
    lines = MD.read_text(encoding="utf-8").splitlines()
    pdf = HandoffPDF()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    pdf.set_left_margin(14)
    pdf.set_right_margin(14)

    in_code = False
    for raw in lines:
        line = raw.rstrip()

        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            pdf.write_block(line, size=9)
            continue

        if not line:
            pdf.ln(3)
            continue

        if line.startswith("# "):
            pdf.ln(4)
            pdf.write_block(line[2:], size=18, style="B", color=(20, 20, 20))
            pdf.ln(2)
        elif line.startswith("## "):
            pdf.ln(3)
            pdf.write_block(line[3:], size=13, style="B", color=(30, 30, 30))
            pdf.ln(1)
        elif line.startswith("### "):
            pdf.ln(2)
            pdf.write_block(line[4:], size=11, style="B", color=(40, 40, 40))
        elif line.startswith("---"):
            pdf.ln(2)
            pdf.set_draw_color(200, 200, 200)
            y = pdf.get_y()
            pdf.line(14, y, pdf.w - 14, y)
            pdf.ln(4)
        elif line.startswith("|"):
            if is_table_sep(line):
                continue
            pdf.write_block(table_to_text(line), size=9)
        elif line.startswith("- "):
            pdf.write_block("  * " + line[2:], size=10)
        elif line.startswith("*") and line.endswith("*"):
            pdf.write_block(line.strip("*"), size=9, style="I", color=(80, 80, 80))
        else:
            pdf.write_block(line, size=10)

    pdf.output(str(PDF))
    print(f"Wrote {PDF}")


if __name__ == "__main__":
    main()
