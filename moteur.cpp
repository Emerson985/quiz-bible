#include<iostream>
#include <vector>
#include <string>
#include <algorithm> // Pour std::transform
#include <cctype>    // Pour ::tolower

using namespace std;

struct Question {
    string question;
    string reponse;
};

// Liste des questions et réponses
vector<Question> questions = {
    {"Quel est le premier livre de la Bible ?", "genese"},
    {"Qui a construit l'arche ?", "noe"},
    {"Combien de commandements Dieu a-t-il donnés à Moïse ?", "10"},
    {"Quel est le dernier livre de la Bible ?", "apocalypse"},
    {"Qui a été avalé par un grand poisson ?", "jonas"},
    {"Qui a reçu les 10 commandements ?", "moise"},
    {"Quel roi a construit le temple de Jérusalem ?", "salomon"},
    {"Qui a renié Jésus trois fois ?", "pierre"},
    {"Quel prophète a confronté le roi Achab ?", "elie"},
    {"Qui était le frère de Moïse ?", "aaron"},
    {"Quel était le nom de l'épouse d'Abraham ?", "sara"},
    {"Dans quel livre trouve-t-on la bataille de David contre Goliath ?", "1 samuel"},
    {"Qui a trahi Jésus ?", "judas"},
    {"Quel est le nom de l'ange qui est apparu à Marie ?", "gabriel"},
    {"Dans quelle ville Jésus est-il né ?", "bethleem"},
    {"Quel est le premier miracle de Jésus ?", "eau en vin"}
};

extern "C" {
    int score = 0;  // Score initial
    int vies = 3;   // Vies initiales
    int indexQuestion = 0;  // Indice de la question actuelle

   // Fonction pour obtenir la question actuelle du quiz
const char* getQuestion() {
    static string questionActuelle; // Conserve la chaîne même après la fin de la fonction (nécessaire car on retourne un pointeur)
    if (indexQuestion >= static_cast<int>(questions.size())) return "FIN"; // Si toutes les questions ont été posées, on retourne "FIN"
    questionActuelle = questions[indexQuestion].question; // On récupère la question actuelle selon l’index
    return questionActuelle.c_str(); // On retourne un pointeur vers la chaîne de caractères
}

// Fonction utilitaire pour convertir une chaîne en minuscules
string toLower(string str) {
    transform(str.begin(), str.end(), str.begin(), ::tolower); // On applique la fonction tolower à chaque caractère de la chaîne
    return str; // On retourne la chaîne convertie en minuscules
}

// Fonction pour vérifier la réponse de l'utilisateur
bool verifierReponse(const char* reponse) {
    if (indexQuestion >= static_cast<int>(questions.size())) return false; // Si on a dépassé la dernière question, la vérification est inutile

    string repUtilisateur = toLower(string(reponse)); // Convertit la réponse de l'utilisateur en minuscules
    string repCorrecte = toLower(questions[indexQuestion].reponse); // Convertit la bonne réponse en minuscules

    if (repUtilisateur == repCorrecte) { // Si les réponses correspondent
        score += 10; // On ajoute 10 points au score
        indexQuestion++; // On passe à la question suivante
        return true; // La réponse est correcte
    } else {
        vies--; // On enlève une vie si la réponse est incorrecte
        if (vies <= 0) { // Si l'utilisateur a perdu toutes ses vies
            score = 0; // Le score est réinitialisé
            indexQuestion = 0; // On recommence les questions depuis le début
            vies = 3; // On redonne 3 vies à l'utilisateur
        }
        return false; // La réponse est incorrecte
    }
}


    // Fonction pour obtenir le score actuel
    int getScore() { 
        return score; 
    }

    // Fonction pour obtenir le nombre de vies restantes
    int getVies() { 
        return vies; 
    }

    // Fonction pour réinitialiser le jeu
    void reinitialiserJeu() {
        score = 0;
        vies = 3;
        indexQuestion = 0;
    }
}

int main() {
    // Exemple d'utilisation du code C++ avec les fonctions externes
    cout << "Jeu du Quiz Biblique" << endl;
    cout << "---------------------" << endl;

    // Jouer tant qu'il y a des questions
    while (true) {
        const char* question = getQuestion();
        if (string(question) == "FIN") {
            cout << "Le quiz est terminé ! Votre score final est : " << getScore() << endl;
            break;
        }

        cout << "Question : " << question << endl;
        cout << "Votre réponse : ";
        string reponseUtilisateur;
        cin >> reponseUtilisateur;

        if (verifierReponse(reponseUtilisateur.c_str())) {
            cout << "Bonne réponse ! Votre score est : " << getScore() << endl;
        } else {
            cout << "Mauvaise réponse ! Vous avez " << getVies() << " vies restantes." << endl;
        }

        if (getVies() <= 0) {
            cout << "GAME OVER ! Votre score final est : " << getScore() << endl;
            break;
        }
    }

    return 0;
}