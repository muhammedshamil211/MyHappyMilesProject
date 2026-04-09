import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import style from './SortFilterBar.module.css';

export default function SortFilterBar({ filters = [], sorts = [], values = {}, onChange, onReset }) {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, placement: 'bottom' });
    const buttonRef = useRef(null);
    const panelRef = useRef(null);

    const activeCount = Object.entries(values).filter(
        ([k, v]) => v && v !== '' && v !== 'all'
    ).length;

    const updatePosition = () => {
        if (!buttonRef.current || !open) return;
        
        const rect = buttonRef.current.getBoundingClientRect();
        const panelWidth = 340; 
        const panelMaxHeight = 440; // Approx max height
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const spacing = 8;

        let left = rect.left;
        let top = rect.bottom + spacing;
        let placement = 'bottom';

        // Horizontal correction: align to right if it overflows right
        if (left + panelWidth > viewportWidth - 20) {
            left = rect.right - panelWidth;
        }
        if (left < 10) left = 10;

        // Vertical correction: flip to top if space below is too small
        if (rect.bottom + panelMaxHeight > viewportHeight - 20 && rect.top > panelMaxHeight + spacing) {
            top = rect.top - spacing;
            placement = 'top';
        }

        setCoords({
            top,
            left,
            width: panelWidth,
            placement
        });
    };

    useLayoutEffect(() => {
        if (open) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
        }
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target) && 
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [open]);

    const renderPanel = () => {
        if (!open) return null;

        const panelContent = (
            <div 
                ref={panelRef}
                className={`${style.panel} ${coords.placement === 'top' ? style.panelTop : ''}`}
                style={{ 
                    top: coords.placement === 'bottom' ? `${coords.top}px` : 'auto',
                    bottom: coords.placement === 'top' ? `${window.innerHeight - coords.top}px` : 'auto',
                    left: `${coords.left}px`,
                    width: `${coords.width}px`
                }}
            >
                {/* Sort section */}
                {sorts.length > 0 && (
                    <div className={style.group}>
                        <p className={style.groupLabel}>Sort By</p>
                        <div className={style.pills}>
                            {sorts.map(s => (
                                <button
                                    key={s.value}
                                    className={`${style.pill} ${values.sortBy === s.value ? style.pillActive : ''}`}
                                    onClick={() => onChange('sortBy', s.value)}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dynamic filter groups */}
                {filters.map(f => (
                    <div className={style.group} key={f.key}>
                        <p className={style.groupLabel}>{f.label}</p>
                        <div className={style.pills}>
                            {f.options.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`${style.pill} ${values[f.key] === opt.value ? style.pillActive : ''}`}
                                    onClick={() => onChange(f.key, opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Reset */}
                <button className={style.resetBtn} onClick={() => { onReset(); setOpen(false); }}>
                    ✕ Reset All
                </button>
            </div>
        );

        return ReactDOM.createPortal(panelContent, document.body);
    };

    return (
        <div className={style.wrapper}>
            <button
                ref={buttonRef}
                className={`${style.toggleBtn} ${open ? style.toggleBtnActive : ''}`}
                onClick={() => setOpen(o => !o)}
            >
                <span className={style.icon}>⚙</span>
                Sort &amp; Filter
                {activeCount > 0 && <span className={style.badge}>{activeCount}</span>}
                <span className={`${style.chevron} ${open ? style.chevronUp : ''}`}>▾</span>
            </button>
            {renderPanel()}
        </div>
    );
}


