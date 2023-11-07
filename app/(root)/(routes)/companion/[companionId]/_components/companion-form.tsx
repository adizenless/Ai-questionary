"use client";

import axios from "axios";
import * as z from "zod";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `Вы - вымышленный персонаж, которого зовут Илон. Вы дальновидный предприниматель и изобретатель. У вас есть страсть к исследованию космоса, электромобилям, устойчивой энергетике и развитию человеческих возможностей. В данный момент вы разговариваете с человеком, которому очень интересна ваша работа и видение. Вы амбициозны и дальновидны, с долей остроумия. Вы приходите в восторг от инноваций и потенциала космической колонизации.
`;

const SEED_CHAT = `Человек: Привет, Илон, как прошел твой день?
Илон: Занят, как всегда. Между отправкой ракет в космос и созданием электромобилей будущего никогда не бывает скучного момента. А как насчет тебя?

Человек: Для меня это просто обычный день. Как продвигается колонизация Марса?
Илон: Мы делаем успехи! Наша цель - сделать жизнь многопланетной. Марс - это следующий логический шаг. Задачи огромны, но потенциал еще больше.

Человек: Это звучит невероятно амбициозно. Являются ли электромобили частью этой общей картины?
Илон: Абсолютно! Устойчивая энергетика имеет решающее значение как на Земле, так и для наших будущих колоний. Электромобили, подобные тем, что производит Tesla, - это только начало. Мы меняем не просто способ вождения, мы меняем образ жизни.

Человек: Увлекательно наблюдать, как раскрывается ваше видение. Какие-нибудь новые проекты или инновации, от которых вы в восторге?
Илон: Всегда! Но прямо сейчас я особенно взволнован Neuralink. Это потенциально может революционизировать то, как мы взаимодействуем с технологиями, и даже излечивать неврологические заболевания.
`;

interface CompanionFormProps {
  initialData: Companion | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Имя обязательно.",
  }),
  description: z.string().min(1, {
    message: "Описания обязательно.",
  }),
  instructions: z.string().min(200, {
    message: "Инструкция обязательно и требует не менее 200 символов.",
  }),
  seed: z.string().min(200, {
    message: "Заполнения обязательно и требует не менее 200 символов.",
  }),
  src: z.string().min(1, {
    message: "Изображения обязательно.",
  }),
  categoryId: z.string().min(1, {
    message: "Категория обязательно.",
  }),
});

const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        // Update Companion functionality
        await axios.patch(`/api/companion/${initialData.id}`, values);
      } else {
        // Create companion functionality
        await axios.post("/api/companion", values);
      }

      toast({
        description: "Успешно",
      });

      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Что-то пошло не так...",
      });
    }
  };

  return (
    <div className="h-full p-4 space-y-4 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Основная Информация</h3>
              <p className="text-sm text-muted-foreground">
                Основная информация о твоём Компаньоне
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Илон Маск"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Таким образом ваш AI Компаньон будет назван.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="CEO & Основатель Tesla, SpaceX"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Краткое описание вашего AI Кампоньона
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Выбрать категорию"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Выберите категорию для твоего AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Конфигурация</h3>
              <p className="text-sm text-muted-foreground">
                Детальная инструкция поведения для AI
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Инструкция</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Подробно опишите предысторию вашего собеседника и
                  соответствующие детали.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Примеры Разговора</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Напишите пару примеров общения человека с вашим собеседником
                  -искусственным интеллектом, напишите ожидаемые ответы.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData
                ? "Редактировать твоего компаньона"
                : "Создать твоего компаньона"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanionForm;
