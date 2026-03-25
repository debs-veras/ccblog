import { useEffect, useState } from "react";
import CardList from "./CardList";
import { useNavigate } from "react-router-dom";
import useToastLoading from "../../../hooks/useToastLoading";
import { searchPosts } from "../../../services/post.service";
import type { Post } from "../../../types/post";
import LoadingPage from "../../../components/LoadingPage";
import Button from "../../../components/UI/Button";

export default function ContainerNews() {
  const toast = useToastLoading();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const registerForPage = 3;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      const response = await searchPosts({
        page: 0,
        limit: registerForPage,
      });

      if (response.success && response.data) setPosts(response.data.data || []);
      else toast({ mensagem: response.message, tipo: response.type });
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="grid max-w-7xl gap-6 xl:grid-cols-2 items-center mx-auto">
      <div className="flex w-full items-center justify-center">
        <img
          src="/img-container-news-home.png"
          alt="Notícias"
          className="w-full max-w-2xl object-contain"
        />
      </div>
      <div className="w-full space-y-6 ">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#112b3c] md:text-2xl">
            Todas as notícias
          </h2>
          <Button
            model="button"
            type="default"
            text="Ver todas"
            onClick={() => navigate("/noticias")}
          />
        </div>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <CardList key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-gray-500">
            Nenhuma noticia encontrada
          </p>
        )}
        {loading && <LoadingPage />}
      </div>
    </div>
  );
}
