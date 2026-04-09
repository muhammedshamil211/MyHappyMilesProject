import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import style from './AdminPackageDetails.module.css';

export default function AdminPackageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        duration: '',
        maxPeople: '',
        images: [''],
        highlights: [''],
        itinerary: [{ day: 1, title: '', description: '' }],
        inclusions: [''],
        exclusions: [''],
    });

    // Load existing package data
    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/v1/package/${id}`);
                const data = await res.json();
                if (data.success) {
                    const p = data.data.package;
                    setForm({
                        title: p.title || '',
                        description: p.description || '',
                        price: p.price || '',
                        duration: p.duration || '',
                        maxPeople: p.maxPeople || '',
                        images: p.images?.length ? p.images : (p.image ? [p.image] : ['']),
                        highlights: p.highlights?.length ? p.highlights : [''],
                        itinerary: p.itinerary?.length ? p.itinerary : [{ day: 1, title: '', description: '' }],
                        inclusions: p.inclusions?.length ? p.inclusions : [''],
                        exclusions: p.exclusions?.length ? p.exclusions : [''],
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);

    // Generic scalar field change
    const handleField = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Array field helpers (images, highlights, inclusions, exclusions)
    const handleArrayChange = (field, index, value) => {
        setForm(prev => {
            const arr = [...prev[field]];
            arr[index] = value;
            return { ...prev, [field]: arr };
        });
    };
    const addArrayItem = (field, defaultVal = '') => {
        setForm(prev => ({ ...prev, [field]: [...prev[field], defaultVal] }));
    };
    const removeArrayItem = (field, index) => {
        setForm(prev => {
            const arr = prev[field].filter((_, i) => i !== index);
            return { ...prev, [field]: arr.length ? arr : [''] };
        });
    };

    // Itinerary helpers
    const handleItineraryChange = (index, key, value) => {
        setForm(prev => {
            const arr = [...prev.itinerary];
            arr[index] = { ...arr[index], [key]: value };
            return { ...prev, itinerary: arr };
        });
    };
    const addDay = () => {
        setForm(prev => ({
            ...prev,
            itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }]
        }));
    };
    const removeDay = (index) => {
        setForm(prev => {
            const arr = prev.itinerary.filter((_, i) => i !== index)
                .map((item, i) => ({ ...item, day: i + 1 }));
            return { ...prev, itinerary: arr.length ? arr : [{ day: 1, title: '', description: '' }] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform validations
        if (!form.title || !form.price || !form.maxPeople) {
            toast.error("Title, Price, and Max People are required");
            return;
        }

        if (isNaN(form.price) || form.price <= 0) {
            toast.error("Enter a valid price");
            return;
        }

        if (isNaN(form.maxPeople) || form.maxPeople <= 0) {
            toast.error("Enter a valid maximum people count");
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...form,
                price: Number(form.price),
                maxPeople: Number(form.maxPeople),
                images: form.images.filter(Boolean),
                highlights: form.highlights.filter(Boolean),
                inclusions: form.inclusions.filter(Boolean),
                exclusions: form.exclusions.filter(Boolean),
            };

            const res = await fetch(`http://localhost:5000/api/v1/packages/${id}/details`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            
            if (data.success) {
                toast.success('Package details saved successfully!');
            } else {
                toast.error(data.message || 'Save failed');
            }
        } catch (err) {
            toast.error('Server error. Try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={style.loading}>Loading package...</div>;

    return (
        <div className={style.page}>
            <div className={style.header}>
                <button className={style.backBtn} onClick={() => navigate(-1)}>← Back</button>
                <h1 className={style.title}>Package Details Editor</h1>
            </div>

            <form onSubmit={handleSubmit} className={style.form}>

                {/* ── Basic Info ── */}
                <section className={style.section}>
                    <h2 className={style.sectionTitle}>Basic Info</h2>
                    <div className={style.grid2}>
                        <label className={style.label}>
                            Title
                            <input className={style.input} name="title" value={form.title} onChange={handleField} required />
                        </label>
                        <label className={style.label}>
                            Duration
                            <input className={style.input} name="duration" value={form.duration} onChange={handleField} placeholder="e.g. 5 Days / 4 Nights" />
                        </label>
                        <label className={style.label}>
                            Price per Person (₹)
                            <input className={style.input} type="number" name="price" value={form.price} onChange={handleField} />
                        </label>
                        <label className={style.label}>
                            Max People
                            <input className={style.input} type="number" name="maxPeople" value={form.maxPeople} onChange={handleField} />
                        </label>
                    </div>
                    <label className={style.label}>
                        Description
                        <textarea className={style.textarea} name="description" value={form.description} onChange={handleField} rows={4} />
                    </label>
                </section>

                {/* ── Images ── */}
                <section className={style.section}>
                    <h2 className={style.sectionTitle}>Images (URLs)</h2>
                    {form.images.map((img, i) => (
                        <div key={i} className={style.rowItem}>
                            <input
                                className={style.input}
                                placeholder={`Image URL ${i + 1}`}
                                value={img}
                                onChange={e => handleArrayChange('images', i, e.target.value)}
                            />
                            <button type="button" className={style.removeBtn} onClick={() => removeArrayItem('images', i)}>✕</button>
                        </div>
                    ))}
                    <button type="button" className={style.addBtn} onClick={() => addArrayItem('images')}>+ Add Image</button>
                </section>

                {/* ── Highlights ── */}
                <section className={style.section}>
                    <h2 className={style.sectionTitle}>Highlights</h2>
                    {form.highlights.map((h, i) => (
                        <div key={i} className={style.rowItem}>
                            <input
                                className={style.input}
                                placeholder="e.g. Sunset cruise included"
                                value={h}
                                onChange={e => handleArrayChange('highlights', i, e.target.value)}
                            />
                            <button type="button" className={style.removeBtn} onClick={() => removeArrayItem('highlights', i)}>✕</button>
                        </div>
                    ))}
                    <button type="button" className={style.addBtn} onClick={() => addArrayItem('highlights')}>+ Add Highlight</button>
                </section>

                {/* ── Itinerary ── */}
                <section className={style.section}>
                    <h2 className={style.sectionTitle}>Itinerary</h2>
                    {form.itinerary.map((day, i) => (
                        <div key={i} className={style.dayCard}>
                            <div className={style.dayHeader}>
                                <span className={style.dayBadge}>Day {day.day}</span>
                                <button type="button" className={style.removeBtn} onClick={() => removeDay(i)}>✕</button>
                            </div>
                            <input
                                className={style.input}
                                placeholder="Day title (e.g. Arrival & City Tour)"
                                value={day.title}
                                onChange={e => handleItineraryChange(i, 'title', e.target.value)}
                            />
                            <textarea
                                className={style.textarea}
                                placeholder="Day description..."
                                value={day.description}
                                rows={3}
                                onChange={e => handleItineraryChange(i, 'description', e.target.value)}
                            />
                        </div>
                    ))}
                    <button type="button" className={style.addBtn} onClick={addDay}>+ Add Day</button>
                </section>

                {/* ── Inclusions & Exclusions side by side ── */}
                <section className={style.section}>
                    <div className={style.incExcGrid}>
                        <div>
                            <h2 className={style.sectionTitle}>✅ Inclusions</h2>
                            {form.inclusions.map((inc, i) => (
                                <div key={i} className={style.rowItem}>
                                    <input
                                        className={style.input}
                                        placeholder="e.g. Hotel accommodation"
                                        value={inc}
                                        onChange={e => handleArrayChange('inclusions', i, e.target.value)}
                                    />
                                    <button type="button" className={style.removeBtn} onClick={() => removeArrayItem('inclusions', i)}>✕</button>
                                </div>
                            ))}
                            <button type="button" className={style.addBtn} onClick={() => addArrayItem('inclusions')}>+ Add</button>
                        </div>
                        <div>
                            <h2 className={style.sectionTitle}>❌ Exclusions</h2>
                            {form.exclusions.map((exc, i) => (
                                <div key={i} className={style.rowItem}>
                                    <input
                                        className={style.input}
                                        placeholder="e.g. Flight charges"
                                        value={exc}
                                        onChange={e => handleArrayChange('exclusions', i, e.target.value)}
                                    />
                                    <button type="button" className={style.removeBtn} onClick={() => removeArrayItem('exclusions', i)}>✕</button>
                                </div>
                            ))}
                            <button type="button" className={style.addBtn} onClick={() => addArrayItem('exclusions')}>+ Add</button>
                        </div>
                    </div>
                </section>

                {/* ── Submit ── */}
                <div className={style.submitRow}>
                    <button type="submit" className={style.saveBtn} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Details'}
                    </button>
                </div>
            </form>
        </div>
    );
}
