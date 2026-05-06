import fs from 'fs';
import path from 'path';
import '../presets-styles.css';

interface PresetMeta {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

async function getPresets(): Promise<PresetMeta[]> {
  const presetsDir = path.join(process.cwd(), 'data', 'presets');
  try {
    const files = fs.readdirSync(presetsDir).filter(f => f.endsWith('.json'));
    return files.map(file => {
      const filePath = path.join(presetsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      const id = file.replace('.json', '');
      return {
        id,
        title: data.meta?.title || id,
        description: data.meta?.description || '',
        image: data.meta?.favicon || `/media/presets/${id}/preview.jpg`,
        category: data.meta?.category || 'other'
      };
    });
  } catch (e) {
    console.error("Error reading presets:", e);
    return [];
  }
}

export default async function PresetsPage() {
  const presets = await getPresets();

  return (
    <div className="presets-page">
      
      {/* Header */}
      <div className="header-section">
        <h1 className="header-title">Choose Your Preset</h1>
        <p className="header-description">
          Select a template to start building your website. Each preset is fully equipped with content and design.
        </p>
      </div>

      {/* Top 3 Styles Explanation */}
      <div className="top3-section">
        <h2 className="top3-title">🎨 Available CSS Styles</h2>
        <p className="top3-description">
          Each preset can be customized with different visual styles. Here are our Top 3 recommended styles:
        </p>

        <div className="top3-grid">
            
           {/* TOP 1: Clean Minimal */}
           <div className="top-style-card">
             <div className="top-style-header">
               <span className="top-style-badge">TOP 1</span>
               <h3 className="top-style-name">Clean Minimal</h3>
             </div>
             <p className="top-style-details">
               <strong>Best for:</strong> Small towns (50k-100k population)<br/>
               <strong>Features:</strong> Lots of white space, clean lines, Inter font<br/>
               <strong>Psychology:</strong> Trust, Simplicity, Easy to scan<br/>
               <strong>Use case:</strong> Official city portal, government announcements
             </p>
           </div>

           {/* TOP 2: Vibrant Community */}
           <div className="top-style-card-vibrant">
             <div className="top-style-header">
               <span className="top-style-badge-vibrant">TOP 2</span>
               <h3 className="top-style-name">Vibrant Community</h3>
             </div>
             <p className="top-style-details">
               <strong>Best for:</strong> Active cities (100k-300k population)<br/>
               <strong>Features:</strong> Blue accent (#3498DB), more images, social feel<br/>
               <strong>Psychology:</strong> Energy, Connection, Activity<br/>
               <strong>Use case:</strong> Student towns, resort cities
             </p>
           </div>

           {/* TOP 3: Cozy Local */}
           <div className="top-style-card-cozy">
             <div className="top-style-header">
               <span className="top-style-badge-cozy">TOP 3</span>
               <h3 className="top-style-name-serif">Cozy Local</h3>
             </div>
             <p className="top-style-details">
               <strong>Best for:</strong> Family-oriented towns, suburbs<br/>
               <strong>Features:</strong> Warm colors, rounded corners, friendly feel<br/>
               <strong>Psychology:</strong> Safety, Comfort, Neighborhood<br/>
               <strong>Use case:</strong> Residential areas, family services
             </p>
           </div>
         
         </div>
       </div>

       {/* Presets Grid */}
       <div className="presets-grid">
         {presets.map((preset) => {
           let badge: string | null = null;
           let badgeClass = 'preset-type-badge';
           if (preset.id.includes('classifieds')) { 
             badge = '🏠 Cozy Local (Top 3)'; 
             badgeClass = 'preset-type-badge-cozy';
           }
           else if (preset.id.includes('restaurant')) { 
             badge = '🎉 Vibrant Community (Top 2)'; 
             badgeClass = 'preset-type-badge-vibrant';
           }
           else if (preset.id.includes('barbershop')) { 
             badge = '✨ Clean Minimal (Top 1)'; 
             badgeClass = 'preset-type-badge';
           }

           // Determine style class based on preset id
           let styleClass = '';
           if (preset.id.includes('classifieds')) styleClass = 'style-cozy-local';
           else if (preset.id.includes('restaurant')) styleClass = 'style-vibrant-community';
           else if (preset.id.includes('barbershop')) styleClass = 'style-clean-minimal';

           return (
             <div key={preset.id} className={`preset-card ${styleClass}`}>
               <div 
                 className="preset-card-image preset-image-bg"
                 style={{ '--bg-image': `url(${preset.image})` } as React.CSSProperties}
               />
               <div className="preset-card-content">
                 <h3 className="preset-card-title">
                   {preset.title}
                   {preset.id === 'local_classifieds' && (
                     <span className="free-badge">FREE + EMAIL AUTH</span>
                   )}
                 </h3>
                 <p className="preset-card-description">
                   {preset.description}
                 </p>
                 {badge && (
                   <div className={badgeClass}>{badge}</div>
                 )}
                 <form action="/api/clone-preset" method="POST">
                   <input type="hidden" name="presetId" value={preset.id} />
                   <button type="submit" className="preset-card-button">
                     {preset.id === 'local_classifieds' ? 'Select & Setup Email Auth' : 'Select Preset'}
                   </button>
                 </form>
               </div>
             </div>
           );
         })}
       </div>
     </div>
   );
}