type SimpleTextBlockProps = {
  title?: string
  text?: string
}

export default function SimpleTextBlock({ title, text }: SimpleTextBlockProps) {
  return (
    <section className="simple-text-block h-pad">
      <div className="text-wrap">
        {title && <h3 className="heading">{title}</h3>}

        {text && <div className="text-content">{text}</div>}
      </div>
    </section>
  )
}
