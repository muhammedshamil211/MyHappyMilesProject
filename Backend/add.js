import PlaceModel from "./models/Place.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
connectDB();
const place = [
  {
    name: "Paris",
    category: "international",
    image: "https://www.usnews.com/object/image/00000180-6260-d187-a5cb-fefd67170001/eiffel-tower-outro-stock.jpg?update-time=1739908225595&size=responsive640",
    coverImage:"https://images.unsplash.com/photo-1551634979-2b11f8c946fe?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Dubai",
    category: "international",
    image: "https://www.cdn.travejar.com/storage/tour_images/17453063400.webp",
    coverImage:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  },
  {
    name: "Thailand",
    category: "international",
    image: "https://www.andamandaphuket.com/sites/andamanda/files/inline-images/thailand-tourist-attractions-4_0.jpg",
    coverImage:"https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Malaysia",
    category: "international",
    image: "https://resize.indiatvnews.com/en/resize/gallery/1200_-/2025/03/1-1741160489.jpg",
    coverImage:"https://images.unsplash.com/photo-1566914447826-bf04e54bf1be?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "New York",
    category: "international",
    image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0",
    coverImage:"https://plus.unsplash.com/premium_photo-1682048358672-1c5c6c9ed2ae?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Tokyo",
    category: "international",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=687&auto=format&fit=crop",
    coverImage:"https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1170&auto=format&fit=crop"
  },
  {
    name: "Bali",
    category: "international",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1170&auto=format&fit=crop",
    coverImage:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1170&auto=format&fit=crop"
  },

  // 🇮🇳 Domestic
  {
    name: "Delhi",
    category: "domestic",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRITYt0lTeubyMKuFRcnr8lYMA44QE-exzDdQ&s",
    coverImage:"https://images.unsplash.com/photo-1580188712482-63ce8922d28c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Manali",
    category: "domestic",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS40dAuljYvCH_6IoVUa-Tf7huR2jGpfEv2jg&s",
    coverImage:"https://images.unsplash.com/photo-1597167231350-d057a45dc868?q=80&w=1682&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Jaipur",
    category: "domestic",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1170&auto=format&fit=crop",
    coverImage:"https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1170&auto=format&fit=crop"
  },
  {
    name: "Goa",
    category: "domestic",
    image: "https://images.unsplash.com/photo-1587922546307-776227941871?q=80&w=1170&auto=format&fit=crop",
    coverImage:"https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Kerala",
    category: "domestic",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1170&auto=format&fit=crop",
    coverImage:"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1170&auto=format&fit=crop"
  }
];


PlaceModel.insertMany(place);
console.log("added");