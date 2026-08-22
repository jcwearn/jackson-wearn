import React from 'react'

// Case study content is data, not JSX, so it needs some way to mark up a symbol
// name or a term without becoming a markdown dependency. This understands two
// things and deliberately nothing else: `code` and **bold**.
//
// Adding a third is a real decision, not a small one -- every construct here is
// one more thing that can be typed wrong in a content file and render as
// literal punctuation on the page.

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*)/g

function parse(text: string): React.ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={i}
          className="rounded bg-gray-200 px-1 py-0.5 font-mono text-[0.9em] text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-gray-900 dark:text-gray-100">
          {part.slice(2, -2)}
        </strong>
      )
    }

    return part
  })
}

const RichText: React.FC<{ children: string }> = ({ children }) => <>{parse(children)}</>

export default RichText
