import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../component/user/layout/Nav/Nav';
import Footer from '../component/user/layout/footer/Footer';
import { LoginContext } from '../context/LoginContext';
import style from './PackageDetailsPage.module.css';
import ReviewSection from '../component/user/components/reviews/ReviewSection';
import StarRating from '../component/user/components/reviews/StarRating';

export default function PackageDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setLogin } = useContext(LoginContext);

    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [openDay, setOpenDay] = useState(null);

    // Like state
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    // Booking form
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const [bookingForm, setBookingForm] = useState({
        name: storedUser?.name || '',
        email: storedUser?.email || '',
        phone: '',
        people: 1,
        date: '',
        specialRequest: '',
    });
    const [bookingMsg, setBookingMsg] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/package/${id}`);
                const data = await res.json();
                if (data.success) {
                    const p = data.data.package;
                    setPkg(p);
                    setLikesCount(p.likes?.length || 0);
                    if (storedUser) {
                        const hasLiked = p.likes?.some(lid =>
                            lid === storedUser.id || lid?._id === storedUser.id
                        );
                        setLiked(hasLiked || false);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
        // increment view silently
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/packages/view/${id}`, { method: 'PUT' }).catch(() => { });
    }, [id]);

    const handleLike = async () => {
        const token = localStorage.getItem('token');
        if (!token) { setLogin(true); return; }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/packages/${id}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setLiked(data.data.liked);
                setLikesCount(data.data.likesCount);
            }
        } catch (err) { console.error(err); }
    };

    const price = pkg?.price || 0;
    const totalAmount = price * bookingForm.people;

    const handleBookingChange = (e) => {
        const val = e.target.name === 'people' ? Number(e.target.value) : e.target.value;
        setBookingForm(prev => ({ ...prev, [e.target.name]: val }));
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) { setLogin(true); return; }

        if (!bookingForm.phone || !bookingForm.date) {
            setBookingMsg('Please fill phone and travel date.');
            return;
        }
        if (pkg?.maxPeople && bookingForm.people > pkg.maxPeople) {
            setBookingMsg(`Maximum ${pkg.maxPeople} people allowed.`);
            return;
        }

        setBookingLoading(true);
        setBookingMsg('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    packageId: id,
                    phone: bookingForm.phone,
                    date: bookingForm.date,
                    people: bookingForm.people,
                    email: bookingForm.email,
                    specialRequest: bookingForm.specialRequest,
                    totalAmount,
                }),
            });
            const data = await res.json();
            setBookingMsg(data.success
                ? '✓ Booking confirmed! Check your profile for bookings.'
                : (data.message || 'Booking failed.')
            );
        } catch {
            setBookingMsg('Server error. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className={style.loadingWrap}>
            <div className={style.spinner}></div>
            <p>Loading package...</p>
        </div>
    );

    if (!pkg) return (
        <div className={style.loadingWrap}>
            <p>Package not found.</p>
            <button className={style.backBtnOrange} onClick={() => navigate(-1)}>← Go Back</button>
        </div>
    );

    const images = pkg.images?.length ? pkg.images : (pkg.image ? [pkg.image] : []);
    const heroImage = images[activeImage] || '';

    return (
        <div className="font-[Poppins] bg-white min-h-screen">
            {/* ── Hero cover (exact match to LandingPage pattern) ── */}
            <div
                className={style.hero}
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className={style.overlay} />
                <div className={style.heroContent}>
                    <Nav />
                    <div className={style.heroText}>
                        <p className={style.heroTitle}>
                            {pkg.title} <span className={style.heroPackages}>Package</span>
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'white' }}>
                            <StarRating rating={pkg.averageRating || 0} readOnly size={18} />
                            <span style={{ fontSize: '0.95rem' }}>{pkg.averageRating || 0} ({pkg.totalReviews || 0} reviews)</span>
                        </div>
                        <p className={style.heroSubtitle}>📍 {pkg.placeId?.name || 'Destination'} | ⏱ {pkg.duration}</p>
                    </div>
                </div>

                {/* Thumbnail strip (only when multiple images) */}
                {images.length > 1 && (
                    <div className={style.thumbnailStrip}>
                        {images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt=""
                                className={`${style.thumb} ${i === activeImage ? style.thumbActive : ''}`}
                                onClick={() => setActiveImage(i)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Main Content Container (Not full width) ── */}
            <div className={style.container}>
                <div className={style.mainGrid}>
                    {/* ── Left Column: Details ── */}
                    <div className={style.detailsCol}>
                        {/* Overview */}
                        {pkg.description && (
                            <div className={style.card}>
                                <h2 className={style.cardTitle}>Overview</h2>
                                <p className={style.bodyText}>{pkg.description}</p>
                            </div>
                        )}

                        {/* Highlights */}
                        {pkg.highlights?.length > 0 && (
                            <div className={style.card}>
                                <h2 className={style.cardTitle}>Highlights</h2>
                                <ul className={style.highlightList}>
                                    {pkg.highlights.map((h, i) => (
                                        <li key={i} className={style.highlightItem}>
                                            <span className={style.dot}>●</span> {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Itinerary */}
                        {pkg.itinerary?.length > 0 && (
                            <div className={style.card}>
                                <h2 className={style.cardTitle}>Itinerary</h2>
                                <div className={style.itineraryList}>
                                    {pkg.itinerary.map((day, i) => (
                                        <div key={i} className={style.dayCard}>
                                            <button
                                                className={style.dayHeader}
                                                onClick={() => setOpenDay(openDay === i ? null : i)}
                                            >
                                                <span className={style.dayBadge}>Day {day.day}</span>
                                                <span className={style.dayTitle}>{day.title}</span>
                                                <span className={style.chevron}>{openDay === i ? '▲' : '▼'}</span>
                                            </button>
                                            {openDay === i && (
                                                <p className={style.dayDesc}>{day.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inclusions & Exclusions */}
                        {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
                            <div className={style.card}>
                                <h2 className={style.cardTitle}>Inclusions & Exclusions</h2>
                                <div className={style.incExcGrid}>
                                    {pkg.inclusions?.length > 0 && (
                                        <div>
                                            <h3 className={style.incLabel}>✅ Included</h3>
                                            <ul className={style.incList}>
                                                {pkg.inclusions.map((inc, i) => <li key={i}>{inc}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {pkg.exclusions?.length > 0 && (
                                        <div>
                                            <h3 className={style.excLabel}>❌ Not Included</h3>
                                            <ul className={style.excList}>
                                                {pkg.exclusions.map((exc, i) => <li key={i}>{exc}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Reviews ── */}
                        <ReviewSection packageId={id} />
                    </div>

                    {/* ── Right Column: Booking & Stats ── */}
                    <div className={style.sidebarCol}>
                        {/* Price & Like Card */}
                        <div className={style.card}>
                            <div className={style.sidebarPriceRow}>
                                <div>
                                    <span className={style.priceLabel}>Price starts from</span>
                                    <p className={style.price}>₹{price.toLocaleString()}</p>
                                    <span className={style.perPerson}>/ person</span>
                                </div>
                                <button
                                    className={`${style.likeBtn} ${liked ? style.likedActive : ''}`}
                                    onClick={handleLike}
                                >
                                    {liked ? '❤️' : '🤍'} {likesCount}
                                </button>
                            </div>
                        </div>

                        {/* Booking Form Card */}
                        <div className={style.card} id="booking">
                            <h2 className={style.cardTitle}>Book Now</h2>
                            <form onSubmit={handleBooking} className={style.bookingForm}>
                                <div className={style.formRow}>
                                    <p className={style.fieldLabel}>Your Name</p>
                                    <input
                                        className={style.fieldInput}
                                        name="name"
                                        value={bookingForm.name}
                                        onChange={handleBookingChange}
                                        required
                                    />
                                </div>
                                <div className={style.formRow}>
                                    <p className={style.fieldLabel}>Phone</p>
                                    <input
                                        className={style.fieldInput}
                                        type="tel"
                                        name="phone"
                                        value={bookingForm.phone}
                                        onChange={handleBookingChange}
                                        required
                                    />
                                </div>
                                <div className={style.formRow}>
                                    <p className={style.fieldLabel}>Travel Date</p>
                                    <input
                                        className={style.fieldInput}
                                        type="date"
                                        name="date"
                                        value={bookingForm.date}
                                        onChange={handleBookingChange}
                                        required
                                    />
                                </div>
                                <div className={style.formRow}>
                                    <p className={style.fieldLabel}>
                                        Guests {pkg.maxPeople ? `(max ${pkg.maxPeople})` : ''}
                                    </p>
                                    <input
                                        className={style.fieldInput}
                                        type="number"
                                        name="people"
                                        min={1}
                                        max={pkg.maxPeople || 99}
                                        value={bookingForm.people}
                                        onChange={handleBookingChange}
                                    />
                                </div>

                                {/* Summary Box */}
                                <div className={style.summaryBox}>
                                    <div className={style.summaryItem}>
                                        <span>Total Amount</span>
                                        <span className={style.totalVal}>₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {bookingMsg && (
                                    <p className={bookingMsg.startsWith('✓') ? style.successMsg : style.errorMsg}>
                                        {bookingMsg}
                                    </p>
                                )}

                                <button type="submit" className={style.bookBtn} disabled={bookingLoading}>
                                    {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
