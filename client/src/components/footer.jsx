export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-6 mt-12 border-t">
      <p>© 2025 Readish. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-2 text-sm">
        <a href="/about" className="hover:underline">About</a>
        <a href="/contact" className="hover:underline">Contact</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Terms</a>
      </div>
    </footer>
  );
}
