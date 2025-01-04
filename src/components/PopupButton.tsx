interface PopupButtonProps {
  text: string
  onClick: () => void
}

export default function PopupButton({ text, onClick }: PopupButtonProps) {
  return (
    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors" onClick={onClick}>
      {text}
    </button>
  )
}