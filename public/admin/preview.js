// ─── SHARED STYLES ────────────────────────────────────────────────────────────
// Inject Tailwind + Google Fonts into the preview iframe
const PreviewStylesheet = () => {
  return h('div', {},
    h('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }),
    h('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' }),
    h('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap' }),
    h('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' }),
    h('script', { src: 'https://cdn.tailwindcss.com' }),
    h('style', {}, `
      body { background: #fbf9f5; font-family: 'Manrope', sans-serif; margin: 0; padding: 0; }
      .font-headline { font-family: 'Noto Serif', serif; }
      .font-abramo { font-family: 'Playfair Display', serif; }
      .preview-label { font-family: 'Manrope', sans-serif; letter-spacing: 0.2em; text-transform: uppercase; font-size: 10px; color: #705a44; display: block; margin-bottom: 16px; }
    `)
  );
};

// ─── MENU PREVIEW ─────────────────────────────────────────────────────────────
const MenuPreview = createClass({
  render() {
    const entry = this.props.entry;
    const description = entry.getIn(['data', 'description']) || 'Each item is made fresh daily with the finest ingredients.';
    const items = entry.getIn(['data', 'items']);
    const itemList = items ? items.toJS() : [];

    return h('div', { style: { background: '#f5f3ef', minHeight: '100vh', padding: '48px 32px' } },
      h(PreviewStylesheet),
      h('span', { className: 'preview-label' }, 'Hand-crafted selection'),
      h('h2', { style: { fontFamily: 'Noto Serif, serif', fontSize: '48px', color: '#1b1c1a', marginBottom: '8px', fontWeight: 400 } }, 'Menu'),
      h('p', { style: { color: '#7f766a', maxWidth: '280px', lineHeight: 1.7, marginBottom: '40px', fontSize: '14px' } }, description),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '32px' } },
        itemList.length === 0
          ? h('p', { style: { color: '#7f766a', fontStyle: 'italic' } }, 'Add menu items to see them here…')
          : itemList.map((item, i) =>
              h('div', { key: i, style: { borderBottom: '1px solid #d1c5b8', paddingBottom: '32px' } },
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' } },
                  h('span', { style: { fontFamily: 'Noto Serif, serif', fontSize: '20px', color: '#1b1c1a' } }, item.name || 'Item Name'),
                  h('span', { style: { fontFamily: 'Noto Serif, serif', color: '#705a44', fontStyle: 'italic', fontSize: '18px' } }, item.price || '$0')
                ),
                h('p', { style: { color: '#7f766a', fontSize: '13px', lineHeight: 1.6, margin: 0 } }, item.description || 'Description…')
              )
            )
      )
    );
  }
});

// ─── STORY PREVIEW ────────────────────────────────────────────────────────────
const StoryPreview = createClass({
  render() {
    const entry = this.props.entry;
    const heading = entry.getIn(['data', 'heading']) || 'Our Story';
    const image = entry.getIn(['data', 'image']) || '';
    const imageAlt = entry.getIn(['data', 'image_alt']) || '';
    const paragraphs = entry.getIn(['data', 'paragraphs']);
    const paraList = paragraphs ? paragraphs.toJS() : [];

    return h('div', { style: { background: '#fbf9f5', minHeight: '100vh', padding: '64px 32px' } },
      h(PreviewStylesheet),
      h('div', { style: { display: 'flex', gap: '48px', alignItems: 'flex-start', maxWidth: '900px', margin: '0 auto' } },
        image && h('div', { style: { flex: '0 0 300px' } },
          h('img', { src: image, alt: imageAlt, style: { width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '16px' } })
        ),
        h('div', { style: { flex: 1 } },
          h('span', { className: 'preview-label' }, 'Our Story'),
          h('h2', { style: { fontFamily: 'Noto Serif, serif', fontSize: '40px', color: '#1b1c1a', fontWeight: 400, lineHeight: 1.2, marginBottom: '24px' } }, heading),
          h('div', { style: { width: '48px', height: '1px', background: '#7f766a', marginBottom: '24px', opacity: 0.4 } }),
          paraList.length === 0
            ? h('p', { style: { color: '#7f766a', fontStyle: 'italic' } }, 'Add paragraphs to see the story here…')
            : paraList.map((para, i) =>
                h('p', { key: i, style: { color: '#4d453c', lineHeight: 1.8, marginBottom: '16px', fontSize: '15px' } }, para)
              )
        )
      )
    );
  }
});

// ─── GALLERY PREVIEW ──────────────────────────────────────────────────────────
const GalleryPreview = createClass({
  render() {
    const entry = this.props.entry;
    const items = entry.getIn(['data', 'items']);
    const itemList = items ? items.toJS() : [];

    return h('div', { style: { background: '#fbf9f5', minHeight: '100vh', padding: '48px 24px' } },
      h(PreviewStylesheet),
      h('span', { className: 'preview-label' }, 'Visual Story'),
      h('h2', { style: { fontFamily: 'Noto Serif, serif', fontSize: '48px', color: '#1b1c1a', fontWeight: 400, marginBottom: '32px' } }, 'Gallery'),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' } },
        itemList.length === 0
          ? h('p', { style: { color: '#7f766a', fontStyle: 'italic', gridColumn: '1/-1' } }, 'Add gallery images to see them here…')
          : itemList.map((item, i) =>
              h('div', { key: i, style: { borderRadius: '12px', overflow: 'hidden', position: 'relative' } },
                h('img', { src: item.image, alt: item.alt, style: { width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' } }),
                item.caption && h('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(27,28,26,0.6)', color: '#fff', padding: '8px 12px', fontSize: '12px', fontFamily: 'Manrope, sans-serif' } }, item.caption)
              )
            )
      )
    );
  }
});

// ─── SITE INFO PREVIEW ────────────────────────────────────────────────────────
const SitePreview = createClass({
  render() {
    const entry = this.props.entry;
    const name = entry.getIn(['data', 'name']) || 'Saint Honoré';
    const tagline = entry.getIn(['data', 'tagline']) || 'Artisan Boulangerie';
    const address = entry.getIn(['data', 'address']) || '';
    const email = entry.getIn(['data', 'email']) || '';
    const copyright = entry.getIn(['data', 'copyright']) || '';
    const hours = entry.getIn(['data', 'hours']);
    const hoursList = hours ? hours.toJS() : [];

    return h('div', { style: { background: '#dbdad6', minHeight: '100vh', padding: '48px 32px' } },
      h(PreviewStylesheet),
      h('span', { className: 'preview-label' }, 'Footer Preview'),
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px' } },
        h('div', {},
          h('div', { style: { marginBottom: '12px' } },
            h('span', { style: { fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#705a44', fontSize: '22px' } }, name.split(' ')[0] + ' '),
            h('span', { style: { fontFamily: 'Noto Serif, serif', color: '#1b1c1a', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px' } }, name.split(' ').slice(1).join(' ') || tagline)
          ),
          h('p', { style: { color: '#7f766a', fontSize: '13px', maxWidth: '200px' } }, address),
          h('p', { style: { color: '#705a44', fontSize: '13px', fontWeight: 500 } }, email)
        ),
        h('div', {},
          h('span', { style: { fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1b1c1a', display: 'block', marginBottom: '12px' } }, 'Hours'),
          hoursList.map((h_, i) =>
            h('p', { key: i, style: { fontSize: '12px', color: '#4d453c', margin: '4px 0' } },
              h('span', { style: { fontWeight: 600 } }, h_.days + ': '),
              h_.time
            )
          )
        ),
        h('p', { style: { color: '#7f766a', fontSize: '12px', alignSelf: 'flex-end' } }, copyright)
      )
    );
  }
});

// ─── REGISTER ALL PREVIEWS ────────────────────────────────────────────────────
CMS.registerPreviewTemplate('site', SitePreview);
CMS.registerPreviewTemplate('story', StoryPreview);
CMS.registerPreviewTemplate('menu', MenuPreview);
CMS.registerPreviewTemplate('gallery', GalleryPreview);
