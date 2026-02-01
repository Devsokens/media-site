import { PublicLayout } from "@/components/PublicLayout";
import { motion } from "framer-motion";

const About = () => {
    return (
        <PublicLayout withSidebar>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="headline-xl text-headline mb-8 border-b border-divider pb-4">
                    À propos de JEUOB
                </h1>

                <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                    <p className="text-xl font-serif text-headline/80 leading-relaxed italic">
                        "Informer, Éduquer, Transformer."
                    </p>

                    <p>
                        Le <strong>Journal de l’Etudiant de l’Université Omar Bongo (JEUOB)</strong> est bien plus qu'une simple plateforme d'information. C'est l'organe de presse officiel au service de la communauté estudiantine de l'UOB.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 my-12">
                        <div className="bg-muted/30 p-6 rounded-2xl border border-divider">
                            <h2 className="text-xl font-bold text-primary mb-3">Notre Mission</h2>
                            <p className="text-sm">
                                Donner une voix aux étudiants, valoriser les initiatives académiques et culturelles, et offrir un espace de réflexion sur les enjeux de notre université.
                            </p>
                        </div>
                        <div className="bg-muted/30 p-6 rounded-2xl border border-divider">
                            <h2 className="text-xl font-bold text-primary mb-3">Notre Vision</h2>
                            <p className="text-sm">
                                Devenir le média de référence pour l'actualité universitaire au Gabon, en alliant excellence journalistique et innovation numérique.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-headline mt-12 mb-4">L'Université Omar Bongo</h2>
                    <p>
                        Ancré au cœur de la plus grande institution d'enseignement supérieur du Gabon, le JEUOB couvre l'ensemble des facultés et départements pour ne rien manquer de la vie sur le campus.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-headline mt-12 mb-4">Rejoignez-nous</h2>
                    <p>
                        Vous êtes passionné par l'écriture, la photographie ou le journalisme ? Le JEUOB est ouvert à toutes les contributions qui font vivre le débat et l'esprit critique.
                    </p>
                </div>
            </motion.div>
        </PublicLayout>
    );
};

export default About;
