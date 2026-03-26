import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/UI/Button";
import { searchPosts } from "../../../services/post.service";
import type { Post } from "../../../types/post";
import { formatDateName } from "../../../utils/formatar";
import OpportunityCard from "./OpportunityCard";

const CATEGORY_IDS = [
  "521361cd-8d5a-477b-8281-a675ccb832e5", // Grupo de Estudo
  "bd54d661-9c70-47e2-a95a-6d8cc866dd27", // Grupo de Extensão
  "a24ff030-b2ac-4efc-b9b6-933fff7fb159", // Grupo de Pesquisa
  "067b93df-2ba8-4613-83ea-ead379b2f7cb", // Vaga de Trabalho
];

export default function Opportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        // Fetch posts from target categories
        const promises = CATEGORY_IDS.map((id) =>
          searchPosts({ categoryId: id, limit: 4, published: true }),
        );

        const results = await Promise.all(promises);
        const allPosts = results
          .filter((res) => res.success && res.data)
          .flatMap((res) => res.data!.data);

        // Sort by date (newest first) and take the first 4
        const sortedPosts = allPosts
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 4);

        setOpportunities(sortedPosts);
      } catch (error) {
        console.error("Erro ao buscar oportunidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto mt-10 md:mt-0 mb-10 md:mb-16 ">
      <div className="flex justify-between items-center mb-6 md:mb-8 w-full">
        <h2 className="color-primary text-xl sm:text-2xl md:text-3xl font-bold">
          Bolsas e Grupos de Estudo
        </h2>
        <Button
          model="button"
          type="default"
          onClick={() => navigate("/noticias")}
        >
          Ver todas
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-75 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"
            />
          ))
        ) : opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              tag={opp.category?.name || "Oportunidade"}
              title={opp.title}
              description={opp.description || ""}
              date={formatDateName(opp.createdAt)}
              slug={opp.slug}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Nenhuma oportunidade encontrada no momento.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Fique atento para novas atualizações em breve!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
