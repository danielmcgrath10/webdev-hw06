defmodule Bulls.Game do
    def new do 
        %{
          target: random_num(),
          guesses: MapSet.new,
          gameActive: true
        }
      end
    
      def guess(st, guess) do
        cond do
            Enum.count(st.guesses) == 8 ->
                raise "No more guesses allowed"
            st.gameActive == false ->
                st
            guess == st.target -> 
                %{st | guesses: MapSet.put(st.guesses, guess), gameActive: false}
            true -> 
                %{st | guesses: MapSet.put(st.guesses, guess)}
        end
      end

      def check(guess, str, index, bulls, cows) do
        if(index < Enum.count(guess)) do
            l1 = Enum.at(guess, index)
            c1 = Enum.at(str, index)
            cond do
                l1 == c1 -> 
                    check(guess, str, index + 1, [1 | bulls], cows)
                Enum.member?(str, l1) -> 
                    check(guess, str, index + 1, bulls, [1 | cows])
                true -> 
                    check(guess, str, index + 1, bulls, cows)
            end
        else
            {bulls, cows}
        end
      end
    
      def view(st) do
        if st.gameActive == true do
            num = st.target
            guess = Enum.at(st.guesses, Enum.count(st.guesses) - 1)
            if num == guess do
                %{
                    bullCow: %{
                        bull: 4,
                        cow: 0
                    },
                    guesses: MapSet.to_list(st.guesses)
                }
            else 
                checkList = String.graphemes(num)
                bulls = []
                cows = []
                if !Enum.empty?(st.guesses) do
                    IO.inspect checkList
                    IO.inspect guess
                    {bulls, cows} = check(String.graphemes(guess), String.graphemes(num), 0, bulls, cows)
                    %{
                        bullCow: %{
                            bull: Enum.count(bulls),
                            cow: Enum.count(cows)
                        },
                        guesses: MapSet.to_list(st.guesses)
                    }
                else
                    %{
                        bullCow: %{
                            bull: Enum.count(bulls),
                            cow: Enum.count(cows)
                        },
                        guesses: MapSet.to_list(st.guesses)
                    }
                end
            end
        else
            %{
                bullCow: %{
                    bull: 4,
                    cow: 0
                },
                guesses: MapSet.to_list(st.guesses)
            }
        end
      end

      def random_num do
        Enum.join(Enum.take(Enum.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 4));
      end
end