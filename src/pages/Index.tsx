import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Dictation {
  id: number;
  title: string;
  text: string;
  description: string;
}

const dictations: Dictation[] = [
  {
    id: 1,
    title: "Диктант №1 - Осень",
    description: "Простые предложения об осени",
    text: "Наступила осень. Дует холодный ветер. Листья падают на землю. Птицы улетают на юг. Дети идут в школу."
  },
  {
    id: 2,
    title: "Диктант №2 - В лесу",
    description: "Рассказ о лесе и животных",
    text: "Мы пошли в лес. Там растут высокие деревья. На ветке сидит белка. Она грызёт орехи. Под кустом спрятался заяц."
  },
  {
    id: 3,
    title: "Диктант №3 - Дружба",
    description: "О дружбе и играх",
    text: "У меня есть друг. Его зовут Петя. Мы вместе играем. Петя добрый и весёлый. Я люблю своего друга."
  },
  {
    id: 4,
    title: "Диктант №4 - Огород",
    description: "Работа в огороде",
    text: "Бабушка работает в огороде. Она поливает грядки. Там растут морковь и лук. Дедушка копает землю. Скоро будет урожай."
  }
];

export default function Index() {
  const [selectedDictation, setSelectedDictation] = useState<Dictation | null>(null);
  const [userText, setUserText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState<number[]>([]);

  const checkDictation = () => {
    if (!selectedDictation) return;

    const original = selectedDictation.text.toLowerCase().replace(/[.,!?;:]/g, '');
    const user = userText.toLowerCase().replace(/[.,!?;:]/g, '');
    
    const originalWords = original.split(/\s+/);
    const userWords = user.split(/\s+/);
    
    const errorPositions: number[] = [];
    const maxLength = Math.max(originalWords.length, userWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (originalWords[i] !== userWords[i]) {
        errorPositions.push(i);
      }
    }
    
    setErrors(errorPositions);
    setIsChecked(true);
  };

  const resetDictation = () => {
    setUserText('');
    setIsChecked(false);
    setErrors([]);
  };

  const selectNewDictation = () => {
    setSelectedDictation(null);
    resetDictation();
  };

  const getScore = () => {
    if (!selectedDictation) return 0;
    const totalWords = selectedDictation.text.split(/\s+/).length;
    const correctWords = totalWords - errors.length;
    return Math.round((correctWords / totalWords) * 100);
  };

  const getGrade = (score: number) => {
    if (score >= 95) return '5';
    if (score >= 80) return '4';
    if (score >= 60) return '3';
    return '2';
  };

  const renderCheckedText = () => {
    if (!selectedDictation || !isChecked) return null;

    const userWords = userText.split(/\s+/);
    
    return (
      <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
        <p className="text-sm font-semibold text-muted-foreground mb-2">Ваш текст с проверкой:</p>
        <div className="leading-relaxed">
          {userWords.map((word, index) => (
            <span key={index}>
              <span
                className={`${
                  errors.includes(index)
                    ? 'bg-destructive/20 text-destructive font-semibold px-1 rounded'
                    : 'text-accent font-medium'
                }`}
              >
                {word}
              </span>
              {index < userWords.length - 1 && ' '}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (!selectedDictation) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Icon name="BookOpen" size={40} className="text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Диктанты 2 класс</h1>
            </div>
            <p className="text-lg text-muted-foreground">1 четверть • Русский язык</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dictations.map((dictation) => (
              <Card 
                key={dictation.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-2"
                onClick={() => setSelectedDictation(dictation)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{dictation.title}</CardTitle>
                      <CardDescription className="text-base">{dictation.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">
                      {dictation.text.split(/\s+/).length} слов
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg">
                    <Icon name="PenTool" size={18} className="mr-2" />
                    Начать диктант
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Icon name="Info" size={24} className="text-primary" />
                <CardTitle>Как пользоваться?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>1. Выберите диктант из списка выше</p>
              <p>2. Прослушайте текст или прочитайте его вслух</p>
              <p>3. Напишите текст в специальном поле</p>
              <p>4. Нажмите кнопку «Проверить» для автоматической проверки</p>
              <p className="text-muted-foreground text-sm mt-4">
                <Icon name="Lightbulb" size={16} className="inline mr-1" />
                Ошибки будут выделены красным цветом, правильные слова — зелёным
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={selectNewDictation}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Вернуться к списку
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{selectedDictation.title}</CardTitle>
            <CardDescription className="text-base">{selectedDictation.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Volume2" size={20} className="text-primary" />
                <p className="font-semibold text-foreground">Текст диктанта:</p>
              </div>
              <p className="text-lg leading-relaxed">{selectedDictation.text}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Всего слов: {selectedDictation.text.split(/\s+/).length}
              </p>
            </div>

            <div className="space-y-3">
              <label className="font-semibold text-foreground flex items-center gap-2">
                <Icon name="Edit3" size={18} />
                Напишите текст:
              </label>
              <Textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Начните писать здесь..."
                className="min-h-[200px] text-base leading-relaxed"
                disabled={isChecked}
              />
              <p className="text-sm text-muted-foreground">
                Слов написано: {userText.trim() ? userText.split(/\s+/).length : 0}
              </p>
            </div>

            {isChecked && (
              <div className="space-y-4 animate-fade-in">
                {renderCheckedText()}
                
                <Card className="bg-accent/10 border-accent">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Icon name="Award" size={24} className="text-accent" />
                      Результат проверки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Правильность:</span>
                        <span className="text-2xl font-bold">{getScore()}%</span>
                      </div>
                      <Progress value={getScore()} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Оценка</p>
                        <p className="text-3xl font-bold text-primary">{getGrade(getScore())}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ошибок</p>
                        <p className="text-3xl font-bold text-destructive">{errors.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Правильно</p>
                        <p className="text-3xl font-bold text-accent">
                          {selectedDictation.text.split(/\s+/).length - errors.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex gap-3">
              {!isChecked ? (
                <>
                  <Button 
                    onClick={checkDictation} 
                    disabled={!userText.trim()}
                    className="flex-1"
                    size="lg"
                  >
                    <Icon name="CheckCircle" size={20} className="mr-2" />
                    Проверить
                  </Button>
                  <Button 
                    onClick={resetDictation} 
                    variant="outline"
                    size="lg"
                  >
                    <Icon name="RotateCcw" size={20} />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={resetDictation} 
                  className="flex-1"
                  size="lg"
                >
                  <Icon name="RefreshCw" size={20} className="mr-2" />
                  Попробовать снова
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
