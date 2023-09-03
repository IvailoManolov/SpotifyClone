'use client';

import * as RadixSlider from "@radix-ui/react-slider";

//npm install @radix-ui/react-slider

interface SliderProps {
    value?: number;
    possibleMax: number;
    onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value = 1, onChange, possibleMax }) => {

    const handleChange = (newValue: number[]) => {
        onChange?.(newValue[0]);
    }

    return (
        <RadixSlider.Root
            className="relative flex items-center select-none touch-none w-full h-10 group"
            defaultValue={[1]}
            value={[value]}
            onValueChange={handleChange}
            max={possibleMax}
            step={0.01}
            aria-label="Volume">

            <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]  ">
                <RadixSlider.Range className="absolute bg-white rounded-full h-full group-hover:bg-green-500 " />
            </RadixSlider.Track>

            <RadixSlider.Thumb className='opacity-0 group-hover:opacity-100 block w-3 h-3 bg-white rounded-full ' aria-label="Volume" />

        </RadixSlider.Root>
    );
}

export default Slider;