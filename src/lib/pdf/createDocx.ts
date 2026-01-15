import { Document, Packer, Paragraph, TextRun } from "docx"
import { saveAs } from "file-saver"

interface GenerateWordArgs {
  fullname: string
  details: string
  selectedDate: Date | null
  selectStart?: Date
  selectEnd?: Date
}
const formatDate = (date?: Date | null) =>
  date ? date.toLocaleDateString() : "N/A"

const formatTime = (date?: Date) =>
  date ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""


export const handleGenerateWord = async ({
  fullname,
  details,
  selectedDate,
  selectStart,
  selectEnd,
}: GenerateWordArgs) => {
  const children: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({ text: "OFFICIAL SUMMON", bold: true, size: 28 }),
      ],
      spacing: { after: 200 },
    }),

    new Paragraph(`To: ${fullname}`),
    new Paragraph(`Date: ${formatDate(selectedDate)}`),
  ]

  // ✅ Conditionally push time paragraph
  if (selectStart) {
    children.push(
      new Paragraph(
        `Time: ${formatTime(selectStart)}${
          selectEnd ? ` - ${formatTime(selectEnd)}` : ""
        }`
      )
    )
  }

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: "Reason:", bold: true }),
        new TextRun(` ${details}`),
      ],
      spacing: { after: 200 },
    }),
    new Paragraph("Authorized by the Barangay Office")
  )

  const doc = new Document({
    sections: [
      {
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, "summon.docx")
}
