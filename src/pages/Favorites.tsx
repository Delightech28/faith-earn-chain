import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";



import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const { t } = useLanguage();



  const [favoriteVerses, setFavoriteVerses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists() && Array.isArray(userSnap.data().favorites)) {
          setFavoriteVerses(userSnap.data().favorites);
        } else {
          setFavoriteVerses([]);
        }
      } else {
        setFavoriteVerses([]);
      }
      setLoading(false);
    };
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Favorite Verses</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : favoriteVerses.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">No Favorite Verses Yet</h2>
            <p className="text-muted-foreground">Start reading and tap the heart icon to save your favorite verses.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteVerses.map((verse) => (
              <div key={verse.id} className="bg-card border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-primary font-medium mb-2">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </div>
                    <p className="text-foreground leading-relaxed">{verse.text}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(verse.id)}
                    className="flex-shrink-0 p-2 hover:bg-accent rounded-full transition-colors"
                  >
                    <Heart 
                      className="w-5 h-5 text-red-500 fill-red-500" 
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;