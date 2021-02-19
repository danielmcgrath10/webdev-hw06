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
            st.gameActive == false ->
                st
            Enum.count(st.guesses) >= 8 ->
                %{st | gameActive: false}
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
                    guesses: MapSet.to_list(st.guesses),
                    gameActive: true
                }
            else
                %{
                    bullCow: %{
                        bull: Enum.count(bulls),
                        cow: Enum.count(cows)
                    },
                    guesses: MapSet.to_list(st.guesses),
                    gameActive: true
                }
            end
        else
            %{
                bullCow: %{
                    bull: 4,
                    cow: 0
                },
                guesses: MapSet.to_list(st.guesses),
                gameActive: false
            }
        end
      end

      def random_num do
        Enum.join(Enum.take(Enum.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), 4));
      end
end