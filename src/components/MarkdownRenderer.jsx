import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import './MarkdownRenderer.css'

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-renderer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <span className="md-image-wrapper">
              <img src={src} alt={alt} loading="lazy" />
              {alt && <span className="md-image-caption">{alt}</span>}
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
