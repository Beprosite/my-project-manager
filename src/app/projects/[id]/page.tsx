'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { IoChevronBack, IoChevronForward, IoClose, IoDownload, IoArrowBack } from 'react-icons/io5';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type ProjectTag = {
  type: 'הדמיות' | 'אנימציה';
  color: string;
}

type Project = {
  id: string;
  name: string;
  status: string;
  thumbnailUrl: string;
  tags: ProjectTag[];
  lastUpdate: string;
  isPaid: boolean;
}

type ProjectFile = {
  type: 'video' | 'image' | 'aerial';  // Removed 'other' since you're not using it
  url: string;
  thumbnail?: string;
  title: string;
}

const TEMP_PROJECTS = [
  {
    id: '1',
    name: 'מיכל',
    status: 'בעבודה',
    thumbnailUrl: 'https://picsum.photos/800/600?random=1',
    tags: [{ type: 'הדמיות', color: 'bg-blue-500' }],
    lastUpdate: new Date().toISOString(),
    isPaid: false
  },
  {
    id: '2',
    name: 'שפר',
    status: 'הסתיים',
    thumbnailUrl: 'https://picsum.photos/800/600?random=2',
    tags: [
      { type: 'הדמיות', color: 'bg-blue-500' },
      { type: 'אנימציה', color: 'bg-purple-500' }
    ],
    lastUpdate: new Date().toISOString(),
    isPaid: true
  }
] as const;

function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [selectedImage, setSelectedImage] = useState<ProjectFile | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (error) {
      console.error('שגיאה בהורדת הקובץ:', error);
      alert('שגיאה בהורדת הקובץ');
    }
  };

  const downloadProject = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      const zip = new JSZip();
      const files = projectData.files;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const response = await fetch(file.url);
        const blob = await response.blob();
        
        const folder = zip.folder(file.type) as JSZip;
        folder.file(file.title, blob);
        
        setDownloadProgress(((i + 1) / files.length) * 100);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' }, 
        (metadata) => {
          setDownloadProgress(metadata.percent);
        }
      );
      
      saveAs(zipBlob, `${projectData.name}_project.zip`);
    } catch (error) {
      console.error('שגיאה בהורדת הפרויקט:', error);
      alert('שגיאה בהורדת הפרויקט');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };
    const currentProject = TEMP_PROJECTS.find(project => project.id === id);

  if (!currentProject) {
    return (
      <div className="min-h-screen p-8" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="glass-effect rounded-xl p-6">
            <h1 className="text-2xl">פרויקט לא נמצא</h1>
          </div>
        </div>
      </div>
    );
  }

  const projectData = {
    id: currentProject.id,
    name: currentProject.name,
    status: currentProject.status,
    lastUpdate: currentProject.lastUpdate,
    hasAerialFootage: true,
    hasAdditionalMaterials: true,
    files: [
      {
        type: 'video' as const,
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://picsum.photos/1920/1080?random=1',
        title: 'Main_Animation_Final_V2.mp4'
      },
      {
        type: 'image' as const,
        url: 'https://picsum.photos/1920/1080?random=2',
        title: 'South_Elevation_001.jpg'
      },
      {
        type: 'image' as const,
        url: 'https://picsum.photos/1920/1080?random=3',
        title: 'South_Elevation_002.jpg'
      },
      {
        type: 'image' as const,
        url: 'https://picsum.photos/1920/1080?random=4',
        title: 'North_Elevation_001.jpg'
      },
      {
        type: 'aerial' as const,
        url: 'https://picsum.photos/1920/1080?random=6',
        title: 'Aerial_View_Top_001.jpg'
      },
      {
        type: 'aerial' as const,
        url: 'https://picsum.photos/1920/1080?random=7',
        title: 'Aerial_View_Front_001.jpg'
      }
    ]
  };

  const navigateImages = (direction: 'next' | 'prev') => {
    if (!selectedImage) return;
    
    const currentIndex = imageFiles.findIndex(img => img.url === selectedImage.url);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === imageFiles.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? imageFiles.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(imageFiles[newIndex]);
    setSelectedImageIndex(newIndex);
  };

  const videoFiles = projectData.files.filter(file => file.type === 'video');
  const imageFiles = projectData.files.filter(file => file.type === 'image');
  const aerialFiles = projectData.files.filter(file => file.type === 'aerial');

  return (
    <>
      <div className="min-h-screen p-8" dir="rtl">
        <div className="max-w-7xl mx-auto">
          {/* כפתור חזרה לדשבורד */}
          <motion.button
            className="flex items-center gap-2 px-4 py-2 mb-4 rounded-lg hover:bg-gray-800/30 transition-colors"
            onClick={() => router.push('/dashboard')}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoArrowBack className="w-5 h-5" />
            <span>חזרה לדשבורד</span>
          </motion.button>

          {/* כותרת הפרויקט */}
          <div className="glass-effect rounded-xl p-6 mb-8">
            <div className="flex flex-col gap-4">
              <div className="text-sm text-gray-400">
                דשבורד / {currentProject.name}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{currentProject.name}</h1>
                  <div className="flex gap-2 items-center text-gray-400">
                    <span>סטטוס: {currentProject.status}</span>
                    <span>•</span>
                    <span>עודכן: {new Date(currentProject.lastUpdate).toLocaleDateString('he-IL')}</span>
                  </div>
                </div>
                <button 
                  className="px-6 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  onClick={downloadProject}
                  disabled={isDownloading}
                >
                  <IoDownload className="w-5 h-5" />
                  <span>{isDownloading ? 'מוריד...' : 'הורד את כל הפרויקט'}</span>
                </button>
              </div>
            </div>

            {isDownloading && (
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {Math.round(downloadProgress)}% הושלם
                </div>
              </div>
            )}
          </div>

          {/* כפתורי חומרים נוספים */}
          {(projectData.hasAerialFootage || projectData.hasAdditionalMaterials) && (
            <div className="flex gap-4 mb-8">
              {aerialFiles.length > 0 && (
                <button className="glass-effect px-6 py-3 rounded-xl hover:bg-gray-800/50 transition-all flex items-center gap-2">
                  <span>צילומי אוויר</span>
                  <span className="bg-gray-700 px-2 py-1 rounded-full text-sm">
                    {aerialFiles.length}
                  </span>
                </button>
              )}
            
            </div>
          )}

          {/* גריד תוכן */}
          <div className="space-y-8">
            {videoFiles.length > 0 && (
              <div className="glass-effect rounded-xl overflow-hidden">
                <video 
                  controls 
                  className="w-full aspect-video object-cover"
                  poster={videoFiles[0].thumbnail}
                >
                  <source src={videoFiles[0].url} type="video/mp4" />
                </video>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageFiles.map((file, index) => (
                <motion.div
                  key={index}
                  className="aspect-video relative cursor-pointer overflow-hidden rounded-xl glass-effect group"
                  onClick={() => {
                    setSelectedImage(file);
                    setSelectedImageIndex(index);
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={file.url}
                    alt={file.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm text-white font-light text-left" dir="ltr">
                        {file.title}
                      </h3>
                      <button
                        className="p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadFile(file.url, file.title);
                        }}
                      >
                        <IoDownload className="w-4 h-4 text-white/80" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* תצוגת תמונה מוגדלת */}
          {selectedImage && (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop"
                onClick={(e) => {
                  if ((e.target as HTMLElement).classList.contains('backdrop')) {
                    setSelectedImage(null);
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="relative w-[98vw] h-[98vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                    sizes="98vw"
                    quality={100}
                  />
                  
                  <button 
                    className="absolute left-4 top-4 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFile(selectedImage.url, selectedImage.title);
                    }}
                  >
                    <IoDownload className="w-6 h-6 text-white/80" />
                  </button>

                  <button 
                    className="absolute left-4 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImages('prev');
                    }}
                  >
                    <IoChevronBack className="w-6 h-6 text-white/80" />
                  </button>
                  
                  <button 
                    className="absolute right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImages('next');
                    }}
                  >
                    <IoChevronForward className="w-6 h-6 text-white/80" />
                  </button>

                  <button 
                    className="absolute right-4 top-4 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                    }}
                  >
                    <IoClose className="w-6 h-6 text-white/80" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full">
                    <h3 className="text-sm text-white/80 font-light" dir="ltr">
                      {selectedImage.title}
                    </h3>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectPage;