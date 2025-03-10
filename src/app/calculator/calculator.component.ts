import { Component, signal } from '@angular/core';
import { Equation, Operator } from '../model/calculator.type';

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
  host: {
    class: 'bg-dark p-4 rounded-4',
  },
})
export class CalculatorComponent {
  equation = signal<Equation>([]);
  equationDisplay = signal('');
  numberInput = signal('0');

  appendToInput(value: number | '.') {
    this.numberInput.update((v) => {
      if (v === '0' && value === 0) return v;
      if ((v === '0' || v === 'Error') && value !== '.') return String(value);

      if (value === '.' && v.includes('.')) {
        return v;
      }

      return v + String(value);
    });
  }

  changeSign() {
    this.numberInput.update((value) => {
      if (value === '0') return value;

      if (value.includes('-')) return value.substring(1);
      return '-' + value;
    });
  }

  deleteFromInput() {
    this.numberInput.update((value) => {
      if (value === '0') return value;
      const hasSign = value.includes('-');
      if (value.length === 1 || (hasSign && value.length === 2)) return '0';

      return value.substring(0, value.length - 1);
    });
  }

  clearInput() {
    this.numberInput.set('0');
  }

  clearAll() {
    this.clearInput();
    this.equation.set([]);
    this.equationDisplay.set('');
  }

  assignOperator(operator: Operator) {
    // If there is already first number and an operator solve the equation
    // use the result as the first number and assign the new operator
    if (typeof this.equation()[1] !== 'undefined') {
      this.calculate();
    }

    // Take the input and add it to the equation
    this.setFirstNumber(Number(this.numberInput()));
    this.clearInput();

    // Add the operator to the equation
    this.equation()[1] = operator;

    this.updateEquationDisplay();
  }

  calculate() {
    if (
      typeof this.equation()[0] === 'undefined' ||
      typeof this.equation()[1] === 'undefined'
    )
      return;

    this.setSecondNumber(Number(this.numberInput()));
    this.clearInput();

    this.updateEquationDisplay();

    let result = this.getResult(this.equation());

    this.numberInput.set(String(result));
    this.equation.set([]);
  }

  getResult(equation: Equation) {
    switch (equation[1]) {
      case '+':
        return equation[0]! + equation[2]!;
      case '-':
        return equation[0]! - equation[2]!;
      case '*':
        return equation[0]! * equation[2]!;
      case '/':
        return equation[0]! / equation[2]!;
      default:
        return 0;
    }
  }

  setFirstNumber(value: number) {
    if (isNaN(value)) {
      this.numberInput.set('Error');
      return;
    }
    this.equation()[0] = value;
  }

  setSecondNumber(value: number) {
    if (isNaN(value)) {
      this.numberInput.set('Error');
      return;
    }
    this.equation()[2] = value;
  }

  updateEquationDisplay() {
    this.equationDisplay.set(this.equation().join(' '));
  }
}
