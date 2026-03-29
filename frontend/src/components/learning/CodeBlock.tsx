import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeExample } from '../../services/learningService';

interface CodeBlockProps {
  example: CodeExample;
}

const LANGUAGES: Record<string, string> = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  typescript: 'typescript',
  html: 'html',
  css: 'css',
};

const CodeBlock = memo(({ example }: CodeBlockProps) => {
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-gray-700/50 bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">{example.title}</span>
          <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-400">
            {LANGUAGES[example.language] || example.language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {showOutput ? 'Hide Output' : 'Show Output'}
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            title="Copy code"
          >
            {copied ? (
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="text-gray-300 font-mono">{example.code}</code>
        </pre>
      </div>

      {/* Output */}
      <AnimatePresence>
        {showOutput && example.output && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-gray-700 bg-gray-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Output</span>
              </div>
              <pre className="text-sm text-emerald-400 font-mono whitespace-pre-wrap">
                {example.output}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

export default CodeBlock;
