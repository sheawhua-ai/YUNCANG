import { Search, Bell, Download, FileText, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
  onActionClick: () => void;
  toggleMobileMenu: () => void;
}

export function Header({ activeTab, onActionClick, toggleMobileMenu }: HeaderProps) {
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mockDownloads = [
    { id: 1, name: '采购单_20240815.xlsx', type: '生成采购单', time: '10分钟前' },
    { id: 2, name: '订单导出_202408.csv', type: '下载订单', time: '2小时前' },
    { id: 3, name: '商品库存_最新.xlsx', type: '下载商品', time: '昨天 15:30' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-16 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-4 md:px-8 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden text-black shrink-0 p-2 -ml-2" onClick={toggleMobileMenu}>
          <Menu size={20} />
        </button>
      </div>
      <div className="flex items-center gap-4 md:gap-6 shrink-0">
        <div className="relative" ref={downloadRef}>
        </div>
      </div>
    </header>
  );
}
