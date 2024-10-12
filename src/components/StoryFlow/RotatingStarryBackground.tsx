export const RotatingStarryBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden perspective-[1000px] z-[-1]">
      <div
        className="absolute top-1/2 left-1/2 w-full h-full z-[-1] opacity-30 bg-cover bg-center min-w-[200%] min-h-[200%] preserve-3d"
        style={{
          backgroundImage: 'url(/bg2.webp)',
          animation: 'rotateBackground 60s linear infinite alternate',
        }}
      />
    </div>
  )
}
